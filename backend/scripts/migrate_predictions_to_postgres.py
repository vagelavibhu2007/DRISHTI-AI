import os
import sys
import argparse
import datetime
import pandas as pd
import numpy as np

# Ensure project root is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import settings
from backend.db.database import engine, init_db, SessionLocal
from backend.models.project_model import Project
from backend.models.risk_prediction_model import RiskPrediction
from backend.models.alert_model import Alert
from backend.models.report_model import ReportMetadata
from backend.ml.model_loader import model_loader
from backend.ml.risk_engine import calculate_overall_risk_score, calculate_risk_level

def run_predictions_migration(commit: bool = False, allow_sqlite: bool = False) -> bool:
    dialect_name = engine.dialect.name
    mode_str = "COMMIT (Apply Database Changes)" if commit else "DRY RUN (Validation Only)"

    print("======================================================================")
    print("DRISHTI AI — ML Risk Predictions Migration & Inference Pipeline")
    print("======================================================================")
    print(f"Execution Mode:          {mode_str}")
    print(f"Configured Dialect:      {dialect_name}")
    print(f"App Version:             {settings.APP_VERSION}")
    print(f"ML Mode:                 {settings.ML_MODE}")
    print(f"Cost Threshold:          {settings.COST_CLASSIFICATION_THRESHOLD}")

    # 1. Target Database Dialect Enforcement
    if commit and dialect_name != "postgresql" and not allow_sqlite:
        print("\n[ERROR: TARGET DATABASE REJECTED]")
        print(f'Production migration requires a PostgreSQL target database, but detected dialect: "{dialect_name}".')
        print("To target PostgreSQL, configure DATABASE_URL in your environment.")
        print("If testing locally on SQLite, re-run with both --commit and --allow-sqlite.")
        print("Stopping migration safely with zero database writes.")
        return False

    # 2. Check ML Model Loaded Status
    if not model_loader.is_cost_classifier_ready or not model_loader.is_time_classifier_ready:
        print("\n[ERROR: ML MODELS NOT READY]")
        print(f"Cost Classifier ready: {model_loader.is_cost_classifier_ready}")
        print(f"Time Classifier ready: {model_loader.is_time_classifier_ready}")
        return False

    print("\n--- ML Production Models Verified ---")
    print(f"  Cost Classifier:       XGBoost Pipeline (Threshold {settings.COST_CLASSIFICATION_THRESHOLD})")
    print(f"  Cost Regressor:        {type(model_loader.cost_regressor).__name__ if model_loader.cost_regressor else 'None'}")
    print(f"  Time Classifier:       Random Forest Pipeline (Threshold 0.50)")
    print(f"  Time Regressor:        {type(model_loader.time_regressor).__name__ if model_loader.time_regressor else 'None'}")

    # 3. Non-destructive DB Schema Init & Read Projects
    init_db()
    db = SessionLocal()
    try:
        projects_query = db.query(Project).all()
        total_projects = len(projects_query)
        print(f"\n--- Phase 1: Database Inspection ---")
        print(f"  Total Projects in DB:                  {total_projects}")

        if total_projects == 0:
            print("\n[ERROR: NO PROJECTS FOUND] The projects table is empty. Please migrate project data first.")
            return False

        existing_predictions_count = db.query(RiskPrediction).count()
        print(f"  Existing Risk Predictions in DB:       {existing_predictions_count}")
        existing_alerts_count = db.query(Alert).count()
        print(f"  Existing Alerts in DB:                 {existing_alerts_count}")
        existing_reports_count = db.query(ReportMetadata).count()
        print(f"  Existing Reports in DB:                {existing_reports_count}")

        # Extract project features for inference
        project_data = []
        for p in projects_query:
            orig_cost = float(p.original_cost_cr) if p.original_cost_cr is not None else 0.0
            cum_exp = float(p.cumulative_expenditure_cr) if p.cumulative_expenditure_cr is not None else 0.0
            phys_prog = float(p.physical_progress_pct) if p.physical_progress_pct is not None else 0.0
            
            exp_pct = p.expenditure_pct_of_original_cost
            if exp_pct is None or pd.isna(exp_pct):
                exp_pct = (cum_exp / orig_cost * 100.0) if orig_cost > 0 else 0.0
            else:
                exp_pct = float(exp_pct)

            project_data.append({
                "project_id": str(p.project_id),
                "Original_Cost_Cr": orig_cost,
                "Cumulative_Expenditure_Cr": cum_exp,
                "Physical_Progress_Pct": phys_prog,
                "Expenditure_Pct_of_Original_Cost": exp_pct,
                "Ministry": str(p.ministry or "Unknown"),
                "Sector": str(p.sector or "Unknown"),
                "State": str(p.state or "Unknown"),
            })

    finally:
        db.close()

    # 4. Construct Feature DataFrame for Batch ML Inference
    feature_df = pd.DataFrame(project_data)
    infer_features = feature_df[[
        "Original_Cost_Cr",
        "Cumulative_Expenditure_Cr",
        "Physical_Progress_Pct",
        "Expenditure_Pct_of_Original_Cost",
        "Ministry",
        "Sector",
        "State"
    ]]

    print(f"\n--- Phase 2: Running ML Inference Pipelines ---")
    print(f"  Input Batch Size:                      {len(infer_features)}")

    # Cost Model Execution
    cost_probas = model_loader.cost_classifier.predict_proba(infer_features)[:, 1]
    cost_reg_raw = model_loader.cost_regressor.predict(infer_features) if model_loader.cost_regressor else None

    # Time Model Execution
    time_probas = model_loader.time_classifier.predict_proba(infer_features)[:, 1]
    time_reg_raw = model_loader.time_regressor.predict(infer_features) if model_loader.time_regressor else None

    # 5. Build and Validate RiskPrediction Objects
    prediction_records = []
    cost_threshold = settings.COST_CLASSIFICATION_THRESHOLD
    time_threshold = 0.50

    risk_level_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    cost_overrun_flags = 0
    time_overrun_flags = 0

    for i in range(len(project_data)):
        pid = project_data[i]["project_id"]
        orig_cost = project_data[i]["Original_Cost_Cr"]

        cost_prob_raw = float(cost_probas[i])
        cost_prob_pct = round(cost_prob_raw * 100.0, 2)
        is_cost_overrun = 1 if cost_prob_raw >= cost_threshold else 0
        if is_cost_overrun:
            cost_overrun_flags += 1

        time_prob_raw = float(time_probas[i])
        time_prob_pct = round(time_prob_raw * 100.0, 2)
        is_time_overrun = 1 if time_prob_raw >= time_threshold else 0
        if is_time_overrun:
            time_overrun_flags += 1

        overall_risk = calculate_overall_risk_score(cost_prob_pct, time_prob_pct)
        risk_lvl = calculate_risk_level(overall_risk)
        risk_level_counts[risk_lvl] = risk_level_counts.get(risk_lvl, 0) + 1

        # Cost regression (np.expm1)
        pred_cost_cr = None
        revised_cost_cr = None
        if cost_reg_raw is not None and is_cost_overrun:
            log_val = float(cost_reg_raw[i])
            cost_val = float(np.expm1(log_val))
            pred_cost_cr = round(max(0.0, cost_val), 2)
            revised_cost_cr = round(orig_cost + pred_cost_cr, 2)

        # Time regression (np.expm1)
        pred_delay_days = None
        if time_reg_raw is not None:
            log_delay = float(time_reg_raw[i])
            delay_val = float(np.expm1(log_delay))
            pred_delay_days = round(max(0.0, delay_val), 0)

        pred_rec = {
            "project_id": pid,
            "cost_overrun_probability": cost_prob_pct,
            "predicted_cost_overrun": is_cost_overrun,
            "time_overrun_probability": time_prob_pct,
            "predicted_time_overrun": is_time_overrun,
            "overall_risk_score": overall_risk,
            "risk_level": risk_lvl,
            "predicted_cost_overrun_cr": pred_cost_cr,
            "estimated_revised_cost_cr": revised_cost_cr,
            "predicted_delay_days": pred_delay_days,
            "model_version": settings.APP_VERSION,
            "execution_mode": "ML_REAL",
            "prediction_timestamp": datetime.datetime.utcnow()
        }
        prediction_records.append(pred_rec)

    # 6. Statistical Validation Summary
    cost_probs_arr = [r["cost_overrun_probability"] for r in prediction_records]
    time_probs_arr = [r["time_overrun_probability"] for r in prediction_records]
    overall_scores_arr = [r["overall_risk_score"] for r in prediction_records]

    print("\n--- Phase 3: ML Inference & Distribution Audit ---")
    print(f"  Total Predictions Generated:           {len(prediction_records)}")
    print(f"  Unique Project_IDs Mapped:             {len(set(r['project_id'] for r in prediction_records))}")
    print(f"  Cost Overrun Probability:")
    print(f"    - Min:                               {min(cost_probs_arr):.2f}%")
    print(f"    - Max:                               {max(cost_probs_arr):.2f}%")
    print(f"    - Mean:                              {np.mean(cost_probs_arr):.2f}%")
    print(f"    - Overrun Flagged (>=40%):           {cost_overrun_flags} ({cost_overrun_flags / len(prediction_records) * 100:.1f}%)")
    print(f"  Time Overrun Probability:")
    print(f"    - Min:                               {min(time_probs_arr):.2f}%")
    print(f"    - Max:                               {max(time_probs_arr):.2f}%")
    print(f"    - Mean:                              {np.mean(time_probs_arr):.2f}%")
    print(f"    - Delay Flagged (>=50%):             {time_overrun_flags} ({time_overrun_flags / len(prediction_records) * 100:.1f}%)")
    print(f"  Overall Risk Score:")
    print(f"    - Min:                               {min(overall_scores_arr):.2f}")
    print(f"    - Max:                               {max(overall_scores_arr):.2f}")
    print(f"    - Mean:                              {np.mean(overall_scores_arr):.2f}")
    print(f"  Risk Level Breakdown:")
    print(f"    - CRITICAL (>=80):                   {risk_level_counts['CRITICAL']}")
    print(f"    - HIGH (50-79.99):                   {risk_level_counts['HIGH']}")
    print(f"    - MEDIUM (25-49.99):                 {risk_level_counts['MEDIUM']}")
    print(f"    - LOW (<25):                         {risk_level_counts['LOW']}")

    if not commit:
        print("\n======================================================================")
        print("DRY RUN COMPLETE: Zero database modifications were made.")
        print(f"All {len(prediction_records)} predictions generated and validated.")
        print("To execute migration, run with --commit.")
        print("======================================================================")
        return True

    # 7. Atomic Database Insertion
    print("\n--- Phase 4: Executing Database Insert Transaction ---")
    db = SessionLocal()
    inserted_count = 0
    try:
        # Check existing predictions for idempotency
        existing_pred_pids = {str(r[0]) for r in db.query(RiskPrediction.project_id).all()}
        new_records = [r for r in prediction_records if r["project_id"] not in existing_pred_pids]
        
        if not new_records:
            print(f"All {len(prediction_records)} risk predictions already exist in database.")
        else:
            for rec in new_records:
                pred_obj = RiskPrediction(**rec)
                db.add(pred_obj)
                inserted_count += 1
                if inserted_count % 500 == 0:
                    db.flush()
                    print(f"  Flushed {inserted_count}/{len(new_records)} prediction records...")

            db.commit()
            print(f"SUCCESS: Successfully inserted {inserted_count} risk_prediction records into {dialect_name}.")

    except Exception as exc:
        db.rollback()
        print(f"ERROR: Transaction failed and rolled back completely. Details: {exc}")
        return False
    finally:
        db.close()

    # 8. Post-Migration Strict Verification
    db_verify = SessionLocal()
    try:
        final_projects_count = db_verify.query(Project).count()
        final_predictions_count = db_verify.query(RiskPrediction).count()
        final_alerts_count = db_verify.query(Alert).count()
        final_reports_count = db_verify.query(ReportMetadata).count()

        print("\n--- Phase 5: Post-Migration Dynamic Verification ---")
        print(f"  Projects Table Count (must remain {total_projects}):      {final_projects_count}")
        print(f"  Risk Predictions Count (must be {total_projects}):        {final_predictions_count}")
        print(f"  Alerts Table Count (must be 0):                           {final_alerts_count}")
        print(f"  Reports Table Count (must be 0):                          {final_reports_count}")
        print(f"  Database Dialect:                                         {db_verify.bind.dialect.name}")

        assert final_projects_count == total_projects, f"Projects count mismatch: {final_projects_count} != {total_projects}"
        assert final_predictions_count == total_projects, f"Predictions count mismatch: {final_predictions_count} != {total_projects}"
        assert final_alerts_count == 0, f"Alerts count must be 0, found {final_alerts_count}"
        assert final_reports_count == 0, f"Reports count must be 0, found {final_reports_count}"

        print("\nAll integrity checks passed successfully!")
    finally:
        db_verify.close()

    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DRISHTI AI ML Risk Predictions Migration Utility")
    parser.add_argument("--commit", action="store_true", help="Execute database insert transaction (default is dry-run)")
    parser.add_argument("--allow-sqlite", action="store_true", help="Allow execution on SQLite for local testing")
    args = parser.parse_args()

    success = run_predictions_migration(commit=args.commit, allow_sqlite=args.allow_sqlite)
    if not success:
        sys.exit(1)
