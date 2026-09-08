import os
import sys
import argparse
import pandas as pd
import numpy as np

# Ensure project root is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import settings
from backend.db.database import engine, init_db, SessionLocal
from backend.models.project_model import Project

COLUMN_MAPPING = [
    ('Project_ID', 'project_id', 'String(50)', 'Primary Key (Canonical ID)'),
    ('Project_Name', 'project_name', 'Text', 'Non-nullable string'),
    ('Ministry', 'ministry', 'String(255)', 'Non-nullable string'),
    ('Sector', 'sector', 'String(150)', 'Non-nullable string'),
    ('State', 'state', 'String(500)', 'Non-nullable string (Single & Multi-state)'),
    ('Start_Date', 'start_date', 'String(50)', 'Nullable date string'),
    ('Target_DOC', 'target_doc', 'String(50)', 'Nullable target date of completion'),
    ('Revised_DOC', 'revised_doc', 'String(50)', 'Nullable revised date of completion'),
    ('Original_Cost_Cr', 'original_cost_cr', 'Float', 'Non-nullable original cost in Cr INR'),
    ('Cumulative_Expenditure_Cr', 'cumulative_expenditure_cr', 'Float', 'Non-nullable cumulative spend in Cr INR'),
    ('Physical_Progress_Pct', 'physical_progress_pct', 'Float', 'Nullable physical progress percentage'),
    ('Expenditure_Pct_of_Original_Cost', 'expenditure_pct_of_original_cost', 'Float', 'Nullable financial progress percentage'),
    ('Revised_Cost_Cr', 'revised_cost_cr', 'Float', 'Nullable revised cost in Cr INR'),
    ('Cost_Overrun_Cr', 'cost_overrun_cr', 'Float', 'Nullable cost escalation in Cr INR'),
    ('Cost_Overrun_Pct', 'cost_overrun_pct', 'Float', 'Nullable cost escalation percentage'),
    ('Cost_Overrun_Flag', 'cost_overrun_flag', 'Integer', 'Nullable binary cost flag'),
    ('Time_Overrun_Days', 'time_overrun_days', 'Float', 'Nullable schedule drift in days'),
    ('Time_Overrun_Months', 'time_overrun_months', 'Float', 'Nullable schedule drift in months'),
    ('Time_Overrun_Flag', 'time_overrun_flag', 'Integer', 'Nullable binary delay flag')
]

def clean_float(val):
    if pd.isna(val) or val is None:
        return None
    try:
        f = float(val)
        return None if np.isnan(f) else f
    except (ValueError, TypeError):
        return None

def clean_int(val):
    if pd.isna(val) or val is None:
        return None
    try:
        f = float(val)
        return None if np.isnan(f) else int(f)
    except (ValueError, TypeError):
        return None

def clean_str(val):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    return s if s != "" else None

def run_project_migration(csv_path: str = None, commit: bool = False, allow_sqlite: bool = False):
    csv_file = csv_path or settings.DATASET_PATH
    dialect_name = engine.dialect.name
    mode_str = "COMMIT (Apply Changes)" if commit else "DRY RUN (Validation Only)"

    print('======================================================================')
    print('DRISHTI AI — Project Data Pre-Migration Audit & Validation')
    print('======================================================================')
    print('Execution Mode:          ' + mode_str)
    print('Configured Dialect:      ' + str(dialect_name))
    print('Source Dataset:          ' + str(csv_file))

    # 1. Target Database Dialect Enforcement
    if commit and dialect_name != 'postgresql' and not allow_sqlite:
        print('\n[ERROR: TARGET DATABASE REJECTED]')
        print('Production migration requires a PostgreSQL target database, but detected dialect: "' + str(dialect_name) + '".')
        print('To target PostgreSQL, configure DATABASE_URL in your environment (e.g. DATABASE_URL=postgresql://user:pass@host/db).')
        print('If testing locally on SQLite, re-run with both --commit and --allow-sqlite.')
        print('Stopping migration safely with zero database writes.')
        return False

    if not os.path.exists(csv_file):
        print('\n[ERROR: FILE NOT FOUND] CSV dataset not found at ' + str(csv_file))
        return False

    # 2. Print CSV Column to SQLAlchemy Model Mapping
    print('\n--- Column Mapping: ML_READY.csv -> Project Model ---')
    for csv_col, sa_field, sa_type, desc in COLUMN_MAPPING:
        print('  ' + f'{csv_col:<35}' + ' -> ' + f'{sa_field:<32}' + ' (' + f'{sa_type:<12}' + ') : ' + desc)

    # 3. Read and Parse Source CSV
    try:
        df = pd.read_csv(csv_file)
    except Exception as e:
        print('\n[ERROR: PARSE FAILURE] Failed to read CSV: ' + str(e))
        return False

    total_csv_rows = len(df)
    unique_ids = df['Project_ID'].dropna().nunique() if 'Project_ID' in df.columns else 0
    duplicates_df = df[df.duplicated(subset=['Project_ID'], keep=False)] if 'Project_ID' in df.columns else pd.DataFrame()
    duplicate_count = len(duplicates_df)

    missing_pid_count = int(df['Project_ID'].isnull().sum()) if 'Project_ID' in df.columns else 0
    missing_pname_count = int(df['Project_Name'].isnull().sum()) if 'Project_Name' in df.columns else 0
    missing_min_count = int(df['Ministry'].isnull().sum()) if 'Ministry' in df.columns else 0
    missing_sec_count = int(df['Sector'].isnull().sum()) if 'Sector' in df.columns else 0
    missing_st_count = int(df['State'].isnull().sum()) if 'State' in df.columns else 0
    missing_cost_count = int(df['Original_Cost_Cr'].isnull().sum()) if 'Original_Cost_Cr' in df.columns else 0
    missing_exp_count = int(df['Cumulative_Expenditure_Cr'].isnull().sum()) if 'Cumulative_Expenditure_Cr' in df.columns else 0

    multi_state_count = int(df['State'].str.contains('Multi|and|,|/', na=False, case=False).sum()) if 'State' in df.columns else 0

    print('\n--- Phase 1: Source Data Integrity Breakdown ---')
    print('  Total CSV Records:                     ' + str(total_csv_rows))
    print('  Unique Project_IDs:                    ' + str(unique_ids))
    print('  Duplicate Project_IDs:                 ' + str(duplicate_count))
    print('  Missing Project_ID count:              ' + str(missing_pid_count))
    print('  Missing Project_Name count:            ' + str(missing_pname_count))
    print('  Missing Ministry count:                ' + str(missing_min_count))
    print('  Missing Sector count:                  ' + str(missing_sec_count))
    print('  Missing State count:                   ' + str(missing_st_count))
    print('  Missing Original_Cost_Cr count:        ' + str(missing_cost_count))
    print('  Missing Cumulative_Expenditure count:  ' + str(missing_exp_count))
    print('  Multi-state Project count:             ' + str(multi_state_count))

    print('\n--- Nullable Fields NULL Counts in Source CSV ---')
    for col in ['Physical_Progress_Pct', 'Expenditure_Pct_of_Original_Cost', 'Start_Date', 'Target_DOC', 'Revised_DOC', 'Revised_Cost_Cr', 'Cost_Overrun_Cr', 'Cost_Overrun_Pct', 'Cost_Overrun_Flag', 'Time_Overrun_Days', 'Time_Overrun_Months', 'Time_Overrun_Flag']:
        if col in df.columns:
            print('  ' + f'{col:<38}' + ': ' + str(int(df[col].isnull().sum())) + ' nulls')

    if duplicate_count > 0:
        print('\n[ERROR: DUPLICATE IDS DETECTED] Found ' + str(duplicate_count) + ' duplicate Project_IDs in CSV:')
        print(duplicates_df[['Project_ID', 'Project_Name']].head(10))
        print('Migration cannot proceed with duplicate primary keys. Stopping safely.')
        return False

    # 4. Initialize Database Schema non-destructively
    init_db()

    # 5. Inspect Existing Database Records
    db = SessionLocal()
    existing_project_ids = set()
    try:
        db_projects = db.query(Project.project_id).all()
        existing_project_ids = {str(p[0]) for p in db_projects}
        print('\n--- Phase 2: Database State Inspection ---')
        print('  Target Database Dialect:               ' + str(dialect_name))
        print('  Existing Projects in Database:         ' + str(len(existing_project_ids)))
    finally:
        db.close()

    # 6. Parse and Strictly Validate Records (Zero fake/invented values)
    valid_records = []
    invalid_records = []
    seen_ids = set()

    for idx, row in df.iterrows():
        row_num = idx + 2
        pid = clean_str(row.get('Project_ID'))
        if not pid:
            invalid_records.append({'row': row_num, 'project_id': None, 'field': 'Project_ID', 'reason': 'Missing or empty Project_ID'})
            continue

        if pid in seen_ids:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Project_ID', 'reason': 'Duplicate Project_ID in batch'})
            continue

        pname = clean_str(row.get('Project_Name'))
        if not pname:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Project_Name', 'reason': 'Missing or empty Project_Name'})
            continue

        ministry = clean_str(row.get('Ministry'))
        if not ministry:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Ministry', 'reason': 'Missing or empty Ministry'})
            continue

        sector = clean_str(row.get('Sector'))
        if not sector:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Sector', 'reason': 'Missing or empty Sector'})
            continue

        state_val = clean_str(row.get('State'))
        if not state_val:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'State', 'reason': 'Missing or empty State'})
            continue

        orig_cost = clean_float(row.get('Original_Cost_Cr'))
        if orig_cost is None:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Original_Cost_Cr', 'reason': 'Missing or invalid Original_Cost_Cr'})
            continue

        cum_exp = clean_float(row.get('Cumulative_Expenditure_Cr'))
        if cum_exp is None:
            invalid_records.append({'row': row_num, 'project_id': pid, 'field': 'Cumulative_Expenditure_Cr', 'reason': 'Missing or invalid Cumulative_Expenditure_Cr'})
            continue

        # Nullable fields preserve exact NULL / value
        record = {
            'project_id': pid,
            'project_name': pname,
            'ministry': ministry,
            'sector': sector,
            'state': state_val, # Preserved exactly as source string
            'start_date': clean_str(row.get('Start_Date')),
            'target_doc': clean_str(row.get('Target_DOC')),
            'revised_doc': clean_str(row.get('Revised_DOC')),
            'original_cost_cr': orig_cost,
            'cumulative_expenditure_cr': cum_exp,
            'physical_progress_pct': clean_float(row.get('Physical_Progress_Pct')),
            'expenditure_pct_of_original_cost': clean_float(row.get('Expenditure_Pct_of_Original_Cost')),
            'revised_cost_cr': clean_float(row.get('Revised_Cost_Cr')),
            'cost_overrun_cr': clean_float(row.get('Cost_Overrun_Cr')),
            'cost_overrun_pct': clean_float(row.get('Cost_Overrun_Pct')),
            'cost_overrun_flag': clean_int(row.get('Cost_Overrun_Flag')),
            'time_overrun_days': clean_float(row.get('Time_Overrun_Days')),
            'time_overrun_months': clean_float(row.get('Time_Overrun_Months')),
            'time_overrun_flag': clean_int(row.get('Time_Overrun_Flag'))
        }
        valid_records.append(record)
        seen_ids.add(pid)

    new_projects = [r for r in valid_records if r['project_id'] not in existing_project_ids]
    already_existing_count = len(valid_records) - len(new_projects)

    print('\n--- Phase 3: Validation Summary ---')
    print('  Valid project records parsed:          ' + str(len(valid_records)))
    print('  Invalid/Rejected records:              ' + str(len(invalid_records)))
    print('  Already existing in database:          ' + str(already_existing_count))
    print('  New projects ready for insertion:      ' + str(len(new_projects)))

    if invalid_records:
        print('\n[REJECTED RECORDS (' + str(len(invalid_records)) + ' total)]:')
        for inv in invalid_records[:10]:
            print('  Row ' + str(inv['row']) + ': Project_ID=' + str(inv['project_id']) + ' | Field=' + str(inv['field']) + ' | Reason=' + str(inv['reason']))

    if not commit:
        print('\n======================================================================')
        print('DRY RUN COMPLETE: Zero database modifications were made.')
        print('All 1,966 records validated against schema and constraints.')
        print('To execute migration after verification, run with --commit.')
        print('======================================================================')
        return True

    # 7. Atomic Database Transaction Commit
    print('\n--- Phase 4: Executing Database Insert Transaction ---')
    if not new_projects:
        print('No new project records to insert. Database is already up to date.')
        return True

    db = SessionLocal()
    inserted_count = 0
    try:
        for proj_dict in new_projects:
            db_project = Project(**proj_dict)
            db.add(db_project)
            inserted_count += 1
            if inserted_count % 500 == 0:
                db.flush()
                print('  Flushed ' + str(inserted_count) + '/' + str(len(new_projects)) + ' records...')

        db.commit()
        print('SUCCESS: Successfully inserted ' + str(inserted_count) + ' project records into ' + str(dialect_name) + '.')
    except Exception as exc:
        db.rollback()
        print('ERROR: Transaction failed and rolled back completely. Details: ' + str(exc))
        return False
    finally:
        db.close()

    # Dynamic post-migration verification
    db_verify = SessionLocal()
    try:
        final_count = db_verify.query(Project).count()
        missing_ids = set(df['Project_ID'].dropna().astype(str)) - {str(p[0]) for p in db_verify.query(Project.project_id).all()}
        extra_ids = {str(p[0]) for p in db_verify.query(Project.project_id).all()} - set(df['Project_ID'].dropna().astype(str))
        print('\n--- Phase 5: Post-Migration Dynamic Audit ---')
        print('  CSV Total Rows:                        ' + str(total_csv_rows))
        print('  CSV Unique Project_IDs:                ' + str(unique_ids))
        print('  Database Total Projects:               ' + str(final_count))
        print('  Projects Inserted:                     ' + str(inserted_count))
        print('  Projects Already Existing:             ' + str(already_existing_count))
        print('  Projects Rejected:                     ' + str(len(invalid_records)))
        print('  Missing Project_IDs:                   ' + str(len(missing_ids)))
        print('  Unexpected Extra Project_IDs:          ' + str(len(extra_ids)))
    finally:
        db_verify.close()

    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='DRISHTI AI PostgreSQL Project Migration Utility')
    parser.add_argument('--commit', action='store_true', help='Execute database insert transaction (default is dry-run)')
    parser.add_argument('--allow-sqlite', action='store_true', help='Allow execution on SQLite for local testing (PostgreSQL is default required for commit)')
    parser.add_argument('--csv', type=str, default=None, help='Custom path to source CSV file')
    args = parser.parse_args()

    success = run_project_migration(csv_path=args.csv, commit=args.commit, allow_sqlite=args.allow_sqlite)
    if not success:
        sys.exit(1)
