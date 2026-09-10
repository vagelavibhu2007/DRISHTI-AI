# DRISHTI AI

## DRISHTI AI — Infrastructure Project Intelligence Platform

> “Don’t Just Monitor Projects — Predict Their Risks.”

[![Project Status](https://img.shields.io/badge/Project%20Status-Active%20Production-emerald.svg)](https://github.com/vagelavibhu2007/DRISHTI-AI)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)](https://drishti-ai-ruby.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-teal.svg)](https://drishti-ai-r9gq.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLAlchemy-336791.svg)](https://drishti-ai-r9gq.onrender.com/health)
[![Machine Learning](https://img.shields.io/badge/ML%20Models-XGBoost%20%7C%20Random%20Forest%20%7C%20SHAP-orange.svg)](https://github.com/vagelavibhu2007/DRISHTI-AI)
[![Geographic Intelligence](https://img.shields.io/badge/GIS-Leaflet%20%7C%20GeoJSON-green.svg)](https://drishti-ai-ruby.vercel.app/geographic-risk)

---

## Overview

**DRISHTI AI** is a predictive machine learning intelligence platform engineered for monitoring, evaluating, and prioritizing risk across central-sector infrastructure projects in India.

Conventional infrastructure management systems operate largely through retrospective reporting—recording cost escalations and timeline slippages only after project milestones or deadlines have already elapsed. **DRISHTI AI** introduces a proactive predictive intelligence layer that evaluates early financial drawdowns, execution velocities, sector hazard baselines, and administrative indicators to forecast cost and schedule risks **6 to 18 months in advance**.

```
Conventional Approach (Retrospective):
Project Data  ──▶  Monitoring  ──▶  Reporting  ──▶  Human Analysis (Post-Facto)

DRISHTI AI Paradigm (Predictive):
Project Data  ──▶  Data Processing  ──▶  ML Risk Prediction  ──▶  Cost & Time Risk
              ──▶  Overall Risk Score  ──▶  Risk Classification  ──▶  Explainable Factors (SHAP)
              ──▶  Early Warning  ──▶  Decision Support & Proactive Intervention
```

---

## Problem Statement

Large-scale public infrastructure investments across Railways, Roads & Highways, Water Resources, Petroleum & Natural Gas, Power, and Urban Development represent multi-lakh crore national commitments. Managing portfolios containing thousands of concurrent capital projects presents distinct governance challenges:

- **Silent Cost Escalations:** Financial burn rates frequently diverge from verified physical progress on the ground before formal revision notices are submitted.
- **Cascading Timeline Slippage:** Land acquisition, right-of-way (RoW) clearances, and statutory approvals create compounded delays.
- **Fragmented Portfolios:** Disparate reporting formats across central ministries and state agencies obscure systemic risk exposure.
- **Delayed Interventions:** Routine monthly progress reports reveal bottlenecks after budgeted allocations have been exhausted.
- **Resource Prioritization Gaps:** Executive leadership and project management offices (PMOs) need objective, data-backed risk scoring to direct auditing resources where capital is most exposed.

**DRISHTI AI does not replace existing monitoring mechanisms**; rather, it augments them by providing an automated, explainable predictive risk intelligence layer.

---

## Proposed Solution

DRISHTI AI unifies supervised machine learning, explainable AI (SHAP), role-based governance, and geospatial intelligence into an executive decision-support system:

$$\text{Project Data} + \text{ML Inference} + \text{Risk Scoring} + \text{SHAP XAI} + \text{Geographic Intelligence} + \text{What-If Simulation} \implies \text{Proactive Governance}$$

By identifying early divergences between financial disbursements and verified physical completion, DRISHTI AI equips central and state authorities with early warnings to intervene while corrective measures are still viable.

---

## Key Features

1. **AI-Based Cost Overrun Prediction:** Predicts cost overrun probability using an optimized **XGBoost Classifier** configured with a high-sensitivity threshold (**0.40**) to maximize early risk detection. Secondary cost overrun volume in ₹ Cr is estimated via trained regression.
2. **Time Overrun & Schedule Delay Estimation:** Evaluates schedule slippage probability using a **Random Forest Classifier Pipeline** and forecasts anticipated delay in calendar days via log-transformed regression.
3. **Composite 0–100 Project Risk Score:** Unifies financial and temporal risk dimensions into a single standardized 0–100 score categorized into four actionable tiers (**Low, Medium, High, Critical**).
4. **Explainable AI (SHAP Framework):** Employs **SHAP (SHapley Additive exPlanations)** TreeExplainer to break down each prediction into quantifiable positive risk drivers and mitigations.
5. **Role-Based Access Control (RBAC):** Backend-enforced dual-tier authority model providing national visibility for Central Authorities and state-scoped views for State Authorities.
6. **PostgreSQL Production Source of Truth:** High-performance database architecture storing 1,966 central infrastructure assets, risk predictions, audit alerts, and user credentials.
7. **Dynamic Prediction Trends:** Historical trajectory modeling with configurable forecast horizons (6M, 12M, 24M) dynamically filtered by Sector and Ministry.
8. **Geographic Risk Intelligence:** Real India map interface powered by Leaflet and GeoJSON, featuring canonical district/city coordinate resolution and micro-separation for co-located assets.
9. **Interactive What-If Scenario Simulation:** Live sandbox enabling analysts to simulate adjustments in physical progress, spend velocity, or statutory approvals and observe the real-time ML risk delta.
10. **Executive Reports & PMO Dossiers:** Generation and export of PMO briefing sheets, project-level risk dossiers, and structured CSV/PDF summaries.
11. **Natural Language AI Assistant:** Interactive query interface providing conversational project lookups, SHAP factor summaries, and regional vulnerability assessments.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DATA INGESTION & POSTGRESQL LAYER                                        │
│    • 1,966 Infrastructure Projects stored in PostgreSQL                      │
│    • Financials (Sanctioned Outlay, Cumulative Spend)                       │
│    • Progress (Physical % vs Fiscal %) & Administrative Metadata            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. PREPROCESSING & FEATURE ENGINEERING                                      │
│    • Median Imputation for numeric features                                 │
│    • One-Hot Encoding for Ministry, Sector, State                           │
│    • Expenditure vs Sanction Ratio & Physical-to-Financial Progress Gaps    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. DUAL-STREAM ML INFERENCE ENGINE                                          │
│    ┌──────────────────────────────────┐ ┌─────────────────────────────────┐ │
│    │ XGBoost Cost Overrun Classifier  │ │ Random Forest Time Classifier   │ │
│    │ (Threshold = 0.40)               │ │ Pipeline                        │ │
│    └────────────────┬─────────────────┘ └────────────────┬────────────────┘ │
└─────────────────────┼────────────────────────────────────┼──────────────────┘
                      │                                    │
                      ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. RISK AGGREGATION & STANDARDIZATION                                       │
│    • Cost Probability (0–100) + Time Probability (0–100)                    │
│    • Overall Risk Score = (Cost Probability + Time Probability) / 2          │
│    • 4-Tier Classification: LOW | MEDIUM | HIGH | CRITICAL                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. EXPLAINABILITY & EARLY WARNING GENERATION                                │
│    • SHAP TreeExplainer calculates top risk-driving feature attributions    │
│    • Automated Rule Engine generates contextual risk alerts                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. FASTAPI BACKEND & REST API LAYER                                         │
│    • High-performance async REST API endpoints with RBAC enforcement        │
│    • OpenAPI / Swagger Documentation at /docs                               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. INTERACTIVE VERCEL REACT FRONTEND                                        │
│    • Executive Dashboard, Project Explorer, Prediction Trends               │
│    • GIS Leaflet Map, What-If Simulation Sandbox, PMO Briefing Exports      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Architecture

```
                                  [ User Browser ]
                                         │
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │          Vercel Frontend (React 18)          │
                 │   Vite • Tailwind CSS • Recharts • Leaflet    │
                 └───────────────────────┬───────────────────────┘
                                         │  HTTPS / REST APIs
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │       Render Backend (FastAPI + Uvicorn)      │
                 │  JWT Auth • RBAC Filters • ML Predictor • SHAP│
                 └───────────────────────┬───────────────────────┘
                                         │  SQLAlchemy ORM
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │              Render PostgreSQL                │
                 │   Users • Projects • Risk Predictions • Alerts│
                 └───────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose & Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js 18** | Modular component architecture, state hooks, responsive UI |
| **Build Tooling** | **Vite 6** | Modern ESM development server and optimized production build pipeline |
| **Styling & Design** | **Tailwind CSS 3.4** | Clean administrative aesthetic, responsive grid layouts, custom tokens |
| **Icons** | **Lucide React** | Consistent, accessible system iconography |
| **Data Visualization** | **Recharts 2.13** | Interactive Area, Bar, Line, and Pie charts for analytical trends |
| **Geospatial Mapping** | **Leaflet 1.9 & React-Leaflet 4.2** | Interactive GIS basemaps with custom risk markers and GeoJSON boundaries |
| **Vector Geometry** | **D3-Geo & TopoJSON Client** | State boundary polygon processing and coordinate math |
| **Client Routing** | **React Router DOM v6** | Client-side routing with authentication guards (`ProtectedRoute`) |
| **API Client** | **Axios** | Asynchronous HTTP client configured with JWT authorization headers |
| **Backend Framework** | **FastAPI** | High-concurrency Python asynchronous REST API framework |
| **ASGI Server** | **Uvicorn** | Production-ready ASGI server |
| **Data Validation** | **Pydantic v2 & Pydantic Settings** | Strict request/response payload validation and environment configuration |
| **ORM & Database Layer** | **SQLAlchemy 2.0** | Relational mapping, query abstraction, and connection pooling |
| **Database Adapter** | **psycopg2-binary** | High-performance PostgreSQL database connector |
| **Production Database** | **PostgreSQL (Render)** | Primary persistent source of truth for assets, users, and predictions |
| **Authentication & Crypto**| **bcrypt & PyJWT** | Password hashing with salt, stateless HS256 JWT tokens |
| **Machine Learning** | **Scikit-learn & XGBoost** | Supervised classification pipelines, regression, and ColumnTransformer |
| **Explainable AI (XAI)** | **SHAP** | TreeExplainer for local feature importance and decision transparency |
| **Data Processing** | **Pandas & NumPy** | In-memory feature manipulation, matrix operations, and array math |
| **Model Persistence** | **Joblib** | Model serialization and rapid artifact loading |

*(Note: CatBoost was evaluated during model development and benchmarking in research notebooks; production inference is standardized on XGBoost and Random Forest).*

---

## AI/ML Pipeline

### 1. Feature Engineering & Preprocessing
The ML models evaluate the following standardized features:

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `Original_Cost_Cr` | Numerical | Sanctioned capital expenditure in ₹ Cr |
| `Cumulative_Expenditure_Cr` | Numerical | Total financial spend to date in ₹ Cr |
| `Physical_Progress_Pct` | Numerical | Verified ground completion percentage (0.0% – 100.0%) |
| `Expenditure_Pct_of_Original_Cost` | Numerical | Ratio of cumulative expenditure to sanctioned cost (%) |
| `Ministry` | Categorical | Union Sponsoring Ministry (One-Hot Encoded) |
| `Sector` | Categorical | Infrastructure sector domain (One-Hot Encoded) |
| `State` | Categorical | Geographic state or multi-state corridor (One-Hot Encoded) |

### 2. Cost Overrun Prediction (XGBoost)
- **Target:** `Cost_Overrun_Flag` (1 = Cost Escalation, 0 = Within Budget)
- **Model:** `XGBClassifier` with `ColumnTransformer` (median numeric imputation + one-hot categorical encoding)
- **Administrative Decision Threshold:** **`0.40` (40%)**
  - Standard 0.50 thresholds frequently fail to flag nascent cost escalations in early stages.
  - Setting the decision threshold to `0.40` prioritizes sensitivity and recall to ensure early administrative visibility.
- **Secondary Cost Regressor:** `RandomForestRegressor` estimating anticipated overrun volume in ₹ Cr.

### 3. Time Overrun Prediction (Random Forest)
- **Target:** `Time_Overrun_Flag` (1 = Schedule Delay, 0 = On Track)
- **Model:** `RandomForestClassifier` Pipeline
- **Secondary Delay Regressor:** Log-transformed regression ($	ext{expm1}$) estimating schedule slippage in calendar days.

### 4. Verified Model Performance Benchmarks

| Metric | Cost Classifier (XGBoost @ 0.40) | Time Classifier (Random Forest) |
| :--- | :---: | :---: |
| **ROC-AUC** | **0.8524** | **0.8410** |
| **Accuracy** | **82.91%** | **81.45%** |
| **Precision** | **70.00%** | **72.10%** |
| **Recall** | **65.42%** | **68.30%** |
| **F1 Score** | **67.63%** | **70.14%** |

---

## Risk Scoring

DRISHTI AI synthesizes financial and temporal hazard dimensions into a unified, transparent index:

$$\text{Overall Risk Score} = \frac{\text{Cost Overrun Probability (\%)} + \text{Time Overrun Probability (\%)}}{2}$$

### Standardized Four-Tier Risk Classification

| Tier | Risk Score Range | Operational Meaning | Recommended Protocol |
| :--- | :---: | :--- | :--- |
| **LOW** | $0.00 - 24.99$ | Project progressing within normal parametric bounds | Routine monthly monitoring |
| **MEDIUM** | $25.00 - 49.99$ | Minor milestone drift or early financial variance | Bi-weekly progress review |
| **HIGH** | $50.00 - 79.99$ | Significant expenditure vs physical progress disparity | Targeted audit & contractor review |
| **CRITICAL** | $80.00 - 100.00$ | Severe risk of major cost escalation and multi-year delay | Immediate inter-ministerial executive intervention |

---

## Explainable AI (SHAP Framework)

To ensure full accountability, DRISHTI AI implements **SHAP (SHapley Additive exPlanations)** TreeExplainer to break down every project risk score into quantifiable feature attributions:

- **Expenditure vs Sanction Ratio:** Evaluates whether fund drawdown pace outstrips planned timeline velocity.
- **Cumulative Financial Burn:** Identifies disproportionate early capital outlays.
- **State-Level RoW & Land Acquisition Patterns:** Quantifies regional statutory clearance friction.
- **Original Project Outlay Scale:** Captures mega-project complexity hazard baselines.
- **Administrative Ministry Track Record:** Evaluates historical clearance turnaround velocity.
- **Sector Hazard Baseline:** Incorporates domain-specific risk weights (e.g. tunneling in Railways vs flat highway paving).

> *Note: SHAP values represent model feature importance and statistical attributions that explain how the algorithm arrived at a specific risk score; they are decision-support insights rather than legal determinations of causality.*

---

## Role-Based Access Control (RBAC)

DRISHTI AI implements a backend-enforced governance model tailored to administrative hierarchies:

```
                  ┌─────────────────────────────────────────┐
                  │          Authenticated Officer          │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
      ┌───────────────────────────┐         ┌───────────────────────────┐
      │     CENTRAL AUTHORITY     │         │      STATE AUTHORITY      │
      ├───────────────────────────┤         ├───────────────────────────┤
      │ • National Overview       │         │ • State-Scoped Portfolio  │
      │ • All 1,966 Projects      │         │ • Assigned State Projects │
      │ • All Ministries & States │         │ • Multi-State Corridors   │
      │ • Inter-Ministerial KPIs  │         │ • Regional Risk Radar     │
      └───────────────────────────┘         └───────────────────────────┘
```

- **Central Authority:** Full national visibility across all 1,966 central sector projects across all 35 States and Union Territories.
- **State Authority:** Strictly scoped project visibility (e.g., Gujarat State Authority views Gujarat-specific projects and authorized inter-state corridors passing through Gujarat).
- **Security:** Authorization is enforced directly at the FastAPI database query layer via token-extracted user claims, ensuring state officers cannot access unauthorized portfolios.

---

## Database Architecture

In production, DRISHTI AI utilizes **Render PostgreSQL** as the persistent source of truth:

```
Vercel React Frontend  ──▶  Render FastAPI Backend  ──▶  SQLAlchemy ORM  ──▶  PostgreSQL Database
```

### Main Database Entities
1. **`users`:** Officer accounts, hashed passwords (`bcrypt`), authority type (`CENTRAL_AUTHORITY` / `STATE_AUTHORITY`), assigned state jurisdiction, official designation, department, and verified Government ID details.
2. **`projects`:** Core repository of 1,966 infrastructure assets with sanctioned budgets, cumulative expenditure, physical progress, target completion dates, and administrative metadata.
3. **`risk_predictions`:** Pre-computed and dynamically refreshed machine learning predictions (cost probability, time probability, overall risk score, risk tier, estimated delay days, predicted overrun in ₹ Cr).
4. **`alerts`:** Active early warning notices generated by risk escalation and progress disparity anomaly detection rules.
5. **`reports`:** Metadata records for generated PMO briefings, executive summaries, and exported dossiers.

---

## Authentication & Security

- **Credential Storage:** All passwords hashed using `bcrypt` before storage.
- **Stateless Tokens:** JSON Web Tokens (JWT) signed with HS256 algorithm and configured expiration.
- **Protected Routes:** React client-side route guards prevent unauthenticated access to system pages.
- **Officer Verification:** Registration requires verified Government ID details (`id_proof_type`, `id_proof_number`, and document attachment).
- **Data Minimization:** Profile photo uploads have been removed from the platform to maintain a clean, security-focused registration process.
- **Zero Credential Exposure:** Health endpoints, logs, and public repositories never expose connection strings, database passwords, or JWT secrets.

---

## Prediction Trends

The **Prediction Trends** module provides multi-horizon trajectory modeling powered directly by PostgreSQL:

- **Forecasting Horizons:** Configurable **6-Month (6M)**, **12-Month (12M)**, and **24-Month (24M)** predictive outlooks.
- **Interactive Slicing:** Dynamic filtering by **Sector** and Union **Ministry**.
- **Real-Time Visualizations:**
  - *Cost Overrun Probability Trend*
  - *Time Overrun Probability Trend*
  - *Composite Risk Score Evolution*
  - *Critical Project Count Growth Curve*

---

## Geographic Risk Intelligence

The **Geographic Risk** radar visualizes spatial risk distribution across India:

- **OpenStreetMap & Carto Basemaps:** Switchable light basemap rendering.
- **State-Level Choropleths:** Dynamic GeoJSON boundaries color-coded by average state risk score.
- **Geographic Precision Transparency:** 
  > *Project locations are visualized using the most specific location information available in the source dataset (canonical district/city/hub coordinate resolution with state-level regional fallbacks). When multiple projects share the same city coordinate, an automated sub-kilometer micro-separation is applied so every project dot remains individually visible and interactive without cluster bubbles or false regional displacement.*
- **Interactive Project Popups:** Clickable project markers displaying live risk tiers, sanctioned outlay, cumulative spend in ₹ Cr, and direct links to deep-dive analytics.

---

## Reports & PMO Intelligence

The **Reports** center equips administrative leaders with decision-ready briefing materials:

- **Executive Briefing Sheet:** High-level summary of at-risk capital value (₹ Cr), critical project count, and ministry risk distribution.
- **PMO Briefing Dossiers:** Structured project-specific briefs containing timeline drift, expenditure ratios, and top SHAP risk factors.
- **Export Options:** Direct CSV data export and print-ready structured PDF summaries.

---

## API & Backend

The FastAPI backend automatically generates interactive OpenAPI documentation accessible when the server is running:

| Documentation Interface | Endpoint Path | Description |
| :--- | :--- | :--- |
| **Swagger UI** | `/docs` | Interactive API explorer to test endpoints directly in browser |
| **ReDoc** | `/redoc` | Clean, responsive technical API documentation |
| **OpenAPI Specification** | `/openapi.json` | Raw OpenAPI JSON schema definition |
| **System Health Check** | `/health` or `/api/health` | Service status, database connectivity, and loaded ML models |

### Key API Endpoints
- `POST /api/auth/login` — Officer authentication and JWT token generation
- `POST /api/auth/register` — Government officer registration with statutory ID details
- `GET /api/auth/me` — Retrieve authenticated user profile and authority jurisdiction
- `GET /api/projects` — Search, filter, and paginate through infrastructure projects
- `GET /api/projects/{id}` — Individual project details with real-time risk predictions
- `POST /api/predict/risk` — Real-time ML inference for single project parameter inputs
- `POST /api/predict/batch` — Batch ML risk assessment across multiple project records
- `GET /api/dashboard/summary` — Executive dashboard KPI metrics and risk breakdown
- `GET /api/risk/high-risk` — Ranked high-risk project escalation queue
- `GET /api/explain/{project_id}` — SHAP feature attributions and risk drivers
- `GET /api/model/info` — Active ML model performance metrics and hyperparameters
- `GET /api/alerts` — System-generated early warning notices

---

## Project Structure

```
DRISHTI-AI/
├── backend/
│   ├── data/
│   │   ├── ML_READY.csv                 # Canonical dataset (1,966 central projects)
│   │   ├── drishti_auth.db              # Local development SQLite database
│   │   └── project_repository.py        # Database query engine & repository layer
│   ├── db/
│   │   └── database.py                  # SQLAlchemy engine, session maker, health checks
│   ├── ml/
│   │   ├── cost_predictor.py            # XGBoost cost classification service
│   │   ├── time_predictor.py            # Random Forest time classification service
│   │   ├── risk_engine.py               # 0-100 risk scoring & early warning engine
│   │   ├── explainer.py                 # SHAP TreeExplainer attribution service
│   │   ├── model_loader.py              # Singleton model artifact loader
│   │   └── predictor_service.py         # Unified ML prediction pipeline
│   ├── models/
│   │   ├── alert_model.py               # Alert SQLAlchemy model
│   │   ├── project_model.py             # Project SQLAlchemy model
│   │   ├── report_model.py              # ReportMetadata SQLAlchemy model
│   │   ├── risk_prediction_model.py     # RiskPrediction SQLAlchemy model
│   │   ├── user_model.py                # User SQLAlchemy model
│   │   ├── cost_model/                  # Serialized XGBoost artifacts & metadata
│   │   └── time_model/                  # Serialized Random Forest artifacts & metadata
│   ├── routers/
│   │   ├── alerts.py                    # /api/alerts router
│   │   ├── auth.py                      # /api/auth router (login, register, RBAC)
│   │   ├── dashboard.py                 # /api/dashboard router
│   │   ├── explain.py                   # /api/explain router (SHAP)
│   │   ├── model_info.py                # /api/model/info router
│   │   ├── predict.py                   # /api/predict router
│   │   ├── projects.py                  # /api/projects router
│   │   └── risk.py                      # /api/risk router
│   ├── schemas/
│   │   └── project_schema.py            # Pydantic request/response models
│   ├── utils/
│   │   ├── dependencies.py              # FastAPI auth & RBAC dependencies
│   │   └── security.py                  # Password hashing & JWT helpers
│   ├── config.py                        # Application settings & environment config
│   ├── main.py                          # FastAPI application entry point
│   └── test_backend.py                  # Comprehensive backend test suite
├── src/
│   ├── components/
│   │   ├── alerts/                      # Early warning card components
│   │   ├── auth/                        # ProtectedRoute and auth wrappers
│   │   ├── charts/                      # Recharts analytical visualizations
│   │   ├── common/                      # Risk badges, gauges, modal dialogs
│   │   ├── dashboard/                   # KPI cards, overview charts
│   │   ├── layout/                      # Navbar, Sidebar, PageContainer, Modals
│   │   ├── map/                         # India Leaflet GIS map component
│   │   ├── projects/                    # Project tables, search filters, SHAP bars
│   │   └── reports/                     # PMO briefing sheet modals
│   ├── context/
│   │   ├── AuthContext.jsx              # Authentication & RBAC React context
│   │   └── DashboardContext.jsx         # Centralized project state provider
│   ├── data/
│   │   ├── canonicalLocations.js        # Verified district/city coordinates dictionary
│   │   ├── india_states_simplified.json # GeoJSON boundary polygons
│   │   ├── indiaMapPaths.js             # SVG fallback coordinate data
│   │   └── mockData.js                  # Initial state baseline data
│   ├── pages/
│   │   ├── AIAssistant.jsx              # Natural language AI copilot interface
│   │   ├── Alerts.jsx                   # Early warnings feed
│   │   ├── Dashboard.jsx                # Main executive dashboard
│   │   ├── ForgotPassword.jsx           # Credential recovery portal
│   │   ├── GeographicRisk.jsx           # Full-page GIS map view
│   │   ├── HighRiskProjects.jsx         # Critical project escalation queue
│   │   ├── Login.jsx                    # Officer sign-in portal
│   │   ├── PredictionTrends.jsx         # Multi-horizon forecast trends
│   │   ├── ProjectDetails.jsx           # Individual project dossier view
│   │   ├── Projects.jsx                 # Filterable projects repository
│   │   ├── Register.jsx                 # Officer onboarding & ID registration
│   │   ├── Reports.jsx                  # Formal report dossier center
│   │   ├── RiskAnalytics.jsx            # Detailed sectoral risk analytics
│   │   └── WhatIfAnalysis.jsx           # Interactive simulation sandbox
│   ├── services/
│   │   └── api.js                       # Centralized Axios API service with local fallback
│   ├── utils/
│   │   └── riskUtils.js                 # Risk calculations, Rupee currency formatting
│   ├── App.jsx                          # Route definitions & app shell
│   ├── index.css                        # Tailwind CSS imports & custom styling
│   └── main.jsx                         # React DOM entry point
├── public/                              # Static public assets
├── package.json                         # Node dependencies & npm scripts
├── requirements.txt                     # Python production dependencies
├── tailwind.config.js                   # Tailwind theme configuration
├── vercel.json                          # Vercel deployment configuration
├── vite.config.js                       # Vite configuration
└── README.md                            # Comprehensive project documentation
```

---

## Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.10 or higher
- **pip:** Python package manager

### 1. Clone the Repository
```bash
git clone https://github.com/vagelavibhu2007/DRISHTI-AI.git
cd DRISHTI-AI
```

### 2. Frontend Installation & Startup
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

### 3. Backend Installation & Startup
In a separate terminal window:

```bash
# Optional: Create and activate a Python virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install required Python dependencies
pip install -r requirements.txt

# Start the FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```
The backend API and Swagger UI will be accessible at:
- **API Root:** `http://localhost:8000`
- **Swagger Documentation:** `http://localhost:8000/docs`
- **Health Endpoint:** `http://localhost:8000/health`

---

## Environment Variables

Configure application settings via environment variables or a `.env` file in the project root:

```env
# Backend Environment Mode ('development' or 'production')
ENVIRONMENT=development

# Backend ML Execution Mode ('real' for live trained models, 'mock' for standalone mode)
ML_MODE=real

# Cost Overrun Classification Decision Threshold
COST_CLASSIFICATION_THRESHOLD=0.40

# Production PostgreSQL Connection URL (Leave empty for SQLite fallback in development)
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

# JWT Authentication Secret Key
JWT_SECRET_KEY=<your-jwt-secret-key>
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server Binding
HOST=0.0.0.0
PORT=8000

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://drishti-ai-ruby.vercel.app

# Frontend API URL (for Vite client)
VITE_API_BASE_URL=http://localhost:8000/api
```

> **Security Note:** Never commit live database credentials, production JWT secrets, or private API keys to version control.

---

## Production Deployment

DRISHTI AI is deployed on cloud infrastructure:

```
[ User Browser ]
       │
       ▼ HTTPS
[ Vercel Frontend ] ──▶ https://drishti-ai-ruby.vercel.app
       │
       ▼ HTTPS / REST APIs
[ Render FastAPI Backend ] ──▶ https://drishti-ai-r9gq.onrender.com
       │
       ▼ SQLAlchemy Connection Pool
[ Render PostgreSQL Database ]
```

### Live Production Links
- **Web Application:** [https://drishti-ai-ruby.vercel.app](https://drishti-ai-ruby.vercel.app)
- **Backend API Base:** [https://drishti-ai-r9gq.onrender.com](https://drishti-ai-r9gq.onrender.com)
- **Interactive Swagger Docs:** [https://drishti-ai-r9gq.onrender.com/docs](https://drishti-ai-r9gq.onrender.com/docs)
- **Backend Health Check:** [https://drishti-ai-r9gq.onrender.com/health](https://drishti-ai-r9gq.onrender.com/health)

---

## Testing

DRISHTI AI includes end-to-end verification test suites across both frontend and backend layers:

### 1. Frontend Production Build Verification
```bash
npm run build
```
*Compiles all React 18 modules, checks JSX syntax, bundles CSS, and validates asset tree integrity.*

### 2. Backend API & ML Model Test Suite
```bash
python backend/test_backend.py
```
*Executes automated test cases verifying:*
- FastAPI root & health endpoint responses
- Database dialect and connectivity
- XGBoost and Random Forest model loading
- Live inference across critical, high, and low risk test cases
- Zero-progress edge case calculations
- SHAP TreeExplainer attributions and feature rankings
- Summary statistics across the 1,966 project population

---

## Example Workflow

1. **Sign In:** An authorized officer signs in via the login portal. The system verifies credentials and applies role claims (`CENTRAL_AUTHORITY` or `STATE_AUTHORITY`).
2. **Review Portfolio:** The officer lands on the **Dashboard**, viewing national KPIs (Total Monitored Outlay, At-Risk Capital in ₹ Cr, Critical Project Counts).
3. **Escalate Critical Assets:** Navigating to **High-Risk Projects**, the officer inspects the prioritized queue of projects with Overall Risk Score $\ge 80$.
4. **Inspect Root Causes:** Opening a project dossier reveals **SHAP Explainability** bars highlighting specific risk-driving factors (e.g. expenditure pacing outpacing physical execution by >30%).
5. **Geographic Risk Analysis:** Switching to **Geographic Risk**, the officer views regional risk distribution across state boundaries and inspects city-level project markers.
6. **Simulate Interventions:** In **What-If Analysis**, the officer simulates accelerating physical completion or adjusting funding drawdowns to test potential risk score reductions.
7. **Export Briefings:** The officer generates a **PMO Briefing Sheet** or exports structured CSV data for inter-ministerial review.

---

## Current Dataset

The production database is populated with **1,966 central sector infrastructure projects**:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `Project_ID` | String / Integer | Unique infrastructure asset identifier |
| `Project_Name` | String | Official nomenclature of the infrastructure project |
| `Ministry` | Categorical | Union Sponsoring Ministry (e.g., Railways, MoRTH, Jal Shakti, Power) |
| `Sector` | Categorical | Infrastructure sector (e.g., Railways, Road Transport, Water Resources) |
| `State` | Categorical | Primary geographic state / multi-state corridor |
| `Original_Cost_Cr` | Float | Initially sanctioned capital budget (in ₹ Cr) |
| `Cumulative_Expenditure_Cr` | Float | Cumulative fiscal disbursement incurred to date (in ₹ Cr) |
| `Physical_Progress_Pct` | Float | Verified ground completion percentage (0.0% – 100.0%) |
| `Expenditure_Pct_of_Original_Cost` | Float | Financial spend divided by original cost (%) |
| `Cost_Overrun_Flag` | Binary | Historical ground truth cost escalation indicator (0 or 1) |
| `Time_Overrun_Days` | Float | Cumulative schedule delay in calendar days |

---

## Future Enhancements

- **Automated Satellite & Drone Progress Ingestion:** Computer vision pipelines for automated earthwork and structural progress verification.
- **RAG-Powered Document Copilot:** LLM retrieval-augmented generation across detailed project reports (DPRs), contract filings, and environmental clearances.
- **Automated Weather & Environmental Hazard Feeds:** Real-time integration of monsoon anomalies and seismic hazard maps into predictive scoring.
- **Multi-Tenant State Portals:** Dedicated state-level administrative portals with granular district-level officer permissions.

---

## Team & Project Information

- **Project Name:** DRISHTI AI — Infrastructure Project Intelligence Platform
- **GitHub Repository:** [https://github.com/vagelavibhu2007/DRISHTI-AI](https://github.com/vagelavibhu2007/DRISHTI-AI)
- **Maintainer:** Vibhukumar Vaghela ([@vagelavibhu2007](https://github.com/vagelavibhu2007))

---

## License

This project is developed for infrastructure risk intelligence, research, and technical evaluation. All rights reserved.\n