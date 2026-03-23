"""
Inference Utilities
Handles model inference and result denormalization.
"""

import torch
from typing import Dict, List
from models.load_models import get_loader, ModelLoader
from utils.smiles_to_graph import smiles_to_graph


def predict_single(smiles: str, model_name: str, loader: ModelLoader = None) -> dict:
    """
    Predict a single property for a molecule.
    
    Args:
        smiles: SMILES string
        model_name: Model key ('homo', 'lumo', 'dipole', 'gap', 'polar')
        loader: ModelLoader instance (uses global if None)
        
    Returns:
        dict with 'value', 'unit', 'property' keys
    """
    if loader is None:
        loader = get_loader()
    
    model, mean, std = loader.load_model(model_name)
    model_info = loader.get_model_info(model_name)
    
    data = smiles_to_graph(smiles)
    
    with torch.no_grad():
        pred = model(data)
    
    value = pred.item() * std + mean
    
    return {
        'property': model_info['display_name'],
        'value': float(value),
        'unit': model_info['unit']
    }


def predict_all(smiles: str, loader: ModelLoader = None) -> List[dict]:
    """
    Predict all available properties for a molecule.
    
    Args:
        smiles: SMILES string
        loader: ModelLoader instance (uses global if None)
        
    Returns:
        List of prediction dictionaries
    """
    if loader is None:
        loader = get_loader()
    
    results = []
    for model_name in loader.MODEL_CONFIG.keys():
        try:
            result = predict_single(smiles, model_name, loader)
            results.append(result)
        except FileNotFoundError:
            # Skip models that haven't been trained yet
            continue
        except Exception as e:
            results.append({
                'property': loader.MODEL_CONFIG[model_name][1],
                'error': str(e)
            })
    
    return results


def batch_predict(smiles_list: List[str], model_name: str, loader: ModelLoader = None) -> List[dict]:
    """
    Batch prediction for multiple molecules.
    
    Args:
        smiles_list: List of SMILES strings
        model_name: Model key to use for prediction
        loader: ModelLoader instance
        
    Returns:
        List of prediction results
    """
    results = []
    for smiles in smiles_list:
        try:
            result = predict_single(smiles, model_name, loader)
            result['smiles'] = smiles
            results.append(result)
        except Exception as e:
            results.append({
                'smiles': smiles,
                'error': str(e)
            })
    
    return results
