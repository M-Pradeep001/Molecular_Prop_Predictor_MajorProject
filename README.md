# MolPredict — Molecular Property Predictor

> **College Major Project** | Deep Learning–based prediction of quantum-chemical molecular properties using E(n)-Equivariant Graph Neural Networks (EGNN).

---

## 📌 Overview

**MolPredict** is a full-stack web application that predicts key quantum-chemical properties of molecules directly from their **SMILES** (Simplified Molecular-Input Line-Entry System) string. It combines a **PyTorch Geometric EGNN backend** with a **React frontend featuring interactive 3D molecular visualization**.

The models are trained on the **QM9 dataset** — a benchmark dataset of ~134,000 small organic molecules with quantum-chemical properties computed via DFT (Density Functional Theory).

---

## 🔬 Predicted Properties

| Property | Symbol | Unit | Description |
|---|---|---|---|
| HOMO Energy | HOMO | eV | Highest Occupied Molecular Orbital energy |
| LUMO Energy | LUMO | eV | Lowest Unoccupied Molecular Orbital energy |
| HOMO-LUMO Gap | Gap | eV | Electronic gap (reactivity indicator) |
| Dipole Moment | μ | Debye | Measure of molecular polarity |
| Polarizability | α | a.u. | Response of electron cloud to electric field |

---

## 🏗️ Architecture

```
Major_Project_College/
├── backend/                  # Python Flask REST API
│   ├── app.py                # Flask application & API endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   ├── egnn_model.py     # EGNN architecture (EGNNLayer + EGNNModel)
│   │   └── load_models.py    # ModelLoader: loads & caches .pt checkpoints
│   ├── utils/
│   │   ├── smiles_to_graph.py # SMILES → PyG Data (3D conformer via RDKit)
│   │   └── inference.py      # Single / all / batch prediction helpers
│   └── weights/              # Trained model checkpoints (.pt files)
│       ├── homo.pt
│       ├── lumo.pt
│       ├── gap.pt
│       ├── dipole.pt
│       └── polar.pt
│
└── frontend/                 # React + Vite web application
    ├── src/
    │   ├── App.jsx            # Root component, state management
    │   ├── services/api.js    # Axios API client
    │   ├── hooks/useTheme.js  # Dark/light theme hook
    │   └── components/
    │       ├── Navbar.jsx
    │       ├── HeroSection.jsx
    │       ├── PredictionPanel.jsx   # SMILES input + 3D viewer (3Dmol.js)
    │       ├── ResultsDashboard.jsx  # Property result cards
    │       ├── ModelExplainer.jsx    # EGNN architecture explainer
    │       ├── PerformanceDashboard.jsx # Model MAE / R² charts (Recharts)
    │       ├── DatasetSection.jsx    # QM9 dataset information
    │       └── EngineeringInsights.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🧠 Model: E(n)-Equivariant GNN (EGNN)

The backbone model is an **EGNN** — a graph neural network that maintains **equivariance under rotations and translations** in 3D space. This is critical for molecular property prediction where orientation shouldn't matter.

### Architecture Details

| Component | Config |
|---|---|
| Input node features | 11-dim (atomic number + padding) |
| EGNN Layers | 4 layers |
| Hidden dimension | 128 |
| Activation | SiLU |
| Readout | Global mean pooling |
| MLP Head | 128 → 128 (SiLU, Dropout 0.1) → 1 |

**Each EGNN Layer** jointly updates:
- **Node features** — via message passing over neighbors
- **3D coordinates** — equivariant coordinate update preserving geometry symmetry

**Training data**: QM9 dataset (quantum chemistry benchmark, ~134k molecules)  
**Normalization**: Each model checkpoint stores the target `mean` and `std` for de-normalization at inference time.

---

## 🚀 Getting Started

### Prerequisites

- **Python** ≥ 3.10
- **Node.js** ≥ 18
- **CUDA** (optional, for GPU acceleration)

---

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

> **Note:** `torch-geometric` requires a matching PyTorch CUDA version. Visit [PyG installation guide](https://pytorch-geometric.readthedocs.io/en/latest/install/installation.html) if you encounter issues.

Place your trained `.pt` weight files in the `backend/weights/` directory.

**Start the Flask server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check, lists loaded models |
| `GET` | `/models` | Returns all model configurations |
| `POST` | `/predict/<model_name>` | Predict a single property |
| `POST` | `/predict/all` | Predict all 5 properties at once |
| `POST` | `/predict/batch/<model_name>` | Batch predict for multiple molecules |
| `POST` | `/molecule/3d` | Get 3D atom positions and bonds |

### Example Request

```bash
curl -X POST http://localhost:5000/predict/all \
  -H "Content-Type: application/json" \
  -d '{"smiles": "CCO"}'
```

### Example Response

```json
{
  "smiles": "CCO",
  "predictions": [
    { "property": "HOMO", "value": -6.89, "unit": "eV" },
    { "property": "LUMO", "value": 1.43, "unit": "eV" },
    { "property": "HOMO-LUMO Gap", "value": 8.32, "unit": "eV" },
    { "property": "Dipole Moment", "value": 1.74, "unit": "Debye" },
    { "property": "Polarization", "value": 33.21, "unit": "a.u." }
  ]
}
```

**Model names**: `homo`, `lumo`, `gap`, `dipole`, `polar`

---

## 💻 Frontend Features

| Feature | Description |
|---|---|
| **SMILES Input** | Enter any valid SMILES string with real-time validation |
| **3D Molecular Viewer** | Interactive 3D visualization powered by **3Dmol.js** |
| **Property Cards** | Animated result cards for all 5 predicted properties |
| **Results Dashboard** | Recharts-based visualization of predictions |
| **Model Explainer** | In-app visual explanation of the EGNN architecture |
| **Performance Dashboard** | MAE and R² scores per property |
| **Dataset Section** | Overview of the QM9 training dataset |
| **Dark/Light Theme** | Toggle between themes |
| **Backend Status** | Live indicator showing API connectivity |

---

## 📦 Dependencies

### Backend (`requirements.txt`)

| Package | Version | Purpose |
|---|---|---|
| `torch` | ≥ 2.0.0 | Deep learning framework |
| `torch-geometric` | ≥ 2.3.0 | Graph neural network primitives |
| `rdkit` | ≥ 2023.9.1 | Cheminformatics (SMILES parsing, 3D conformer generation) |
| `flask` | ≥ 2.3.0 | REST API server |
| `flask-cors` | ≥ 4.0.0 | Cross-origin requests for frontend |
| `numpy` | ≥ 1.24.0 | Numerical operations |

### Frontend (`package.json`)

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `vite` | Build tool & dev server |
| `framer-motion` | Animations & transitions |
| `recharts` | Charts for performance metrics |
| `3dmol` | 3D molecular visualization |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS framework |
| `axios` | HTTP client for API calls |

---

## 🔄 Data Pipeline

```
SMILES String
     │
     ▼
RDKit Parsing & Validation
     │
     ▼
Add Explicit Hydrogens
     │
     ▼
3D Conformer Generation (ETKDG)
     │
     ▼
UFF Geometry Optimization
     │
     ▼
Build PyG Data Object
   ├── x:          [N_atoms, 11]  (atomic features)
   ├── pos:        [N_atoms, 3]   (3D coordinates)
   └── edge_index: [2, N_bonds×2] (undirected bonds)
     │
     ▼
EGNN Forward Pass → Raw Prediction
     │
     ▼
De-normalize (value × std + mean)
     │
     ▼
Return predicted property value + unit
```

---

## ⚠️ Disclaimer

Predictions are generated by ML models trained on the QM9 dataset and are intended **for research and educational purposes only**. They should not be used in safety-critical applications or as substitutes for experimental measurements.

---

## 📄 License

This project was developed as a **College Major Project**. All rights reserved by the authors.
