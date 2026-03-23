"""
Backend API Application
Flask/FastAPI application for molecular property prediction.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from models.load_models import get_loader
from utils.inference import predict_single, predict_all, batch_predict
from utils.smiles_to_graph import validate_smiles


app = Flask(__name__)
CORS(app)

# Initialize model loader on startup
loader = get_loader(weights_dir='weights')
loader.load_all()   # 🔥 ADD THIS LINE


@app.route('/')
def health_check():
    """API health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'Molecular Property Prediction API',
        'models': loader.list_models()
    })


@app.route('/models')
def list_models():
    """List all available models."""
    return jsonify({
        'models': loader.list_models()
    })


@app.route('/predict/<model_name>', methods=['POST'])
def predict_endpoint(model_name):
    """
    Predict a single property.
    
    Request body: {"smiles": "CCO"}
    """
    data = request.get_json()
    
    if not data or 'smiles' not in data:
        return jsonify({'error': 'Missing smiles in request body'}), 400
    
    smiles = data['smiles']
    
    if not validate_smiles(smiles):
        return jsonify({'error': f'Invalid SMILES: {smiles}'}), 400
    
    try:
        result = predict_single(smiles, model_name, loader)
        result['smiles'] = smiles
        return jsonify(result)
    except FileNotFoundError:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict/all', methods=['POST'])
def predict_all_endpoint():
    """
    Predict all available properties.
    
    Request body: {"smiles": "CCO"}
    """
    data = request.get_json()
    print(f"[DEBUG] Received data: {data}")
    
    if not data or 'smiles' not in data:
        print("[DEBUG] Missing smiles in request")
        return jsonify({'error': 'Missing smiles in request body'}), 400
    
    smiles = data['smiles']
    print(f"[DEBUG] SMILES: {smiles}")
    
    if not validate_smiles(smiles):
        print(f"[DEBUG] Invalid SMILES: {smiles}")
        return jsonify({'error': f'Invalid SMILES: {smiles}'}), 400
    
    try:
        results = predict_all(smiles, loader)
        print(f"[DEBUG] Results: {results}")
        return jsonify({
            'smiles': smiles,
            'predictions': results
        })
    except Exception as e:
        print(f"[DEBUG] Exception: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/predict/batch/<model_name>', methods=['POST'])
def predict_batch_endpoint(model_name):
    """
    Batch prediction for multiple molecules.
    
    Request body: {"smiles_list": ["CCO", "c1ccccc1"]}
    """
    data = request.get_json()
    
    if not data or 'smiles_list' not in data:
        return jsonify({'error': 'Missing smiles_list in request body'}), 400
    
    smiles_list = data['smiles_list']
    
    try:
        results = batch_predict(smiles_list, model_name, loader)
        return jsonify({'predictions': results})
    except FileNotFoundError:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/molecule/3d', methods=['POST'])
def get_molecule_3d():
    """
    Get 3D coordinates and bonds for a molecule.
    
    Request body: {"smiles": "CCO"}
    
    Returns:
        {
            "smiles": "CCO",
            "atoms": [{"elem": "C", "x": 0.0, "y": 0.0, "z": 0.0, "index": 0}, ...],
            "bonds": [[0, 1], [1, 2], ...]
        }
    """
    data = request.get_json()
    
    if not data or 'smiles' not in data:
        return jsonify({'error': 'Missing smiles in request body'}), 400
    
    smiles = data['smiles']
    
    if not validate_smiles(smiles):
        return jsonify({'error': f'Invalid SMILES: {smiles}'}), 400
    
    try:
        from rdkit import Chem
        from rdkit.Chem import AllChem
        
        # Parse SMILES
        mol = Chem.MolFromSmiles(smiles)
        mol = Chem.AddHs(mol)
        
        # Generate 3D conformer
        embed_result = AllChem.EmbedMolecule(mol, AllChem.ETKDG())
        if embed_result != 0:
            return jsonify({'error': 'Failed to generate 3D conformer'}), 500
        
        AllChem.UFFOptimizeMolecule(mol)
        
        # Extract atoms
        atoms = []
        conf = mol.GetConformer()
        
        for i, atom in enumerate(mol.GetAtoms()):
            pos = conf.GetAtomPosition(i)
            atoms.append({
                'index': i,
                'elem': atom.GetSymbol(),
                'x': pos.x,
                'y': pos.y,
                'z': pos.z,
                'atomic_num': atom.GetAtomicNum()
            })
        
        # Extract bonds
        bonds = []
        for bond in mol.GetBonds():
            bonds.append([bond.GetBeginAtomIdx(), bond.GetEndAtomIdx()])
        
        return jsonify({
            'smiles': smiles,
            'atoms': atoms,
            'bonds': bonds
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
