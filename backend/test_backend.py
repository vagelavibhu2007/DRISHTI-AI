import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_and_health():
    print("\n--- Testing Root & Health ---")
    res = client.get("/")
    assert res.status_code == 200
    print("Root response:", res.json()["platform"], res.json()["status"])
    
    res = client.get("/health")
    assert res.status_code == 200
    print("Health response:", res.json())

def test_model_info():
    print("\n--- Testing Model Info ---")
    res = client.get("/api/model/info")
    assert res.status_code == 200
    data = res.json()
    print("Cost Model:", data["cost_model"]["model_type"])
    print("Time Model:", data["time_model"]["model_type"])
    assert data["cost_model"]["threshold"] == 0.40
    assert "82.91%" in data["cost_model"]["accuracy_at_threshold_0_4"]

def test_prediction_cases():
    print("\n--- Testing Project Predictions ---")
    
    # Case 1: Critical project (Low progress, high expenditure)
    critical_p = {
        "project_id": "701410",
        "project_name": "Relining of Rajasthan Feeder and Sirhind Feeder",
        "Original_Cost_Cr": 1976.4,
        "Cumulative_Expenditure_Cr": 1892.5,
        "Physical_Progress_Pct": 42.0,
        "Expenditure_Pct_of_Original_Cost": 95.8,
        "Ministry": "Ministry of Jal Shakti",
        "Sector": "Water Resources",
        "State": "Punjab"
    }
    res = client.post("/api/predict/risk", json=critical_p)
    assert res.status_code == 200
    data = res.json()
    print("\n[Critical Project 701410 Response]")
    print(f"Cost Probability: {data['cost_overrun_probability']}% (Classified: {data['predicted_cost_overrun']})")
    print(f"Time Probability: {data['time_overrun_probability']}%")
    print(f"Overall Risk Score: {data['overall_risk_score']} ({data['risk_level']})")
    print(f"Predicted Cost Overrun: INR {data['predicted_cost_overrun_cr']} Cr")
    print(f"Estimated Revised Cost: INR {data['estimated_revised_cost_cr']} Cr")
    print(f"Predicted Delay: {data['predicted_delay_days']} days")
    print(f"Warnings: {data['warnings']}")
    assert data["risk_level"] in ["CRITICAL", "HIGH"]
    assert data["predicted_cost_overrun"] == 1

    # Case 2: Low-risk project (92% progress, 70% expenditure)
    low_p = {
        "project_id": "709999",
        "project_name": "Solar Grid Evacuation Gujarat",
        "Original_Cost_Cr": 2000.0,
        "Cumulative_Expenditure_Cr": 1400.0,
        "Physical_Progress_Pct": 92.0,
        "Expenditure_Pct_of_Original_Cost": 70.0,
        "Ministry": "Ministry of Power",
        "Sector": "Power & Renewable",
        "State": "Gujarat"
    }
    res = client.post("/api/predict/risk", json=low_p)
    assert res.status_code == 200
    low_data = res.json()
    print("\n[Low-Risk Project Response]")
    print(f"Cost Probability: {low_data['cost_overrun_probability']}%")
    print(f"Time Probability: {low_data['time_overrun_probability']}%")
    print(f"Overall Risk Score: {low_data['overall_risk_score']} ({low_data['risk_level']})")
    assert low_data["cost_overrun_probability"] < 30.0
    assert low_data["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

    # Case 3: Edge Case (0% physical progress)
    zero_p = {
        "project_id": "700000",
        "project_name": "New Greenfield Expressway",
        "Original_Cost_Cr": 5000.0,
        "Cumulative_Expenditure_Cr": 1200.0,
        "Physical_Progress_Pct": 0.0,
        "Expenditure_Pct_of_Original_Cost": 24.0,
        "Ministry": "Ministry of Road Transport & Highways",
        "Sector": "Road Transport",
        "State": "Haryana"
    }
    res = client.post("/api/predict/risk", json=zero_p)
    assert res.status_code == 200
    print("\n[0% Progress Edge Case]: Overall Risk =", res.json()["overall_risk_score"])

def test_explain_and_repository():
    print("\n--- Testing SHAP Explainability & Repository ---")
    res = client.get("/api/explain/701410")
    assert res.status_code == 200
    exp_data = res.json()
    print("SHAP Explanations:")
    for f in exp_data["top_contributing_features"]:
        print(f" - {f['display_name']}: {f['impact']}% ({f['direction']}) -> {f['detail']}")

    # Dashboard Summary
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    summary = res.json()
    print("\nDashboard Summary:")
    print(f"Total Projects: {summary['totalProjects']}, Critical: {summary['criticalProjects']}, Avg Score: {summary['averageRiskScore']}")
    assert summary["totalProjects"] > 0
    assert summary["criticalProjects"] >= 0

    # High Risk list
    res = client.get("/api/risk/high-risk?risk_level=CRITICAL&limit=5")
    assert res.status_code == 200
    high_list = res.json()
    print(f"\nHigh Risk count: {high_list['total']}")
    print("Top 1 high risk project:", high_list["highRiskProjects"][0]["projectName"])

if __name__ == "__main__":
    test_root_and_health()
    test_model_info()
    test_prediction_cases()
    test_explain_and_repository()
    print("\n>>> ALL BACKEND API & ML MODEL TESTS PASSED SUCCESSFULLY! <<<")

