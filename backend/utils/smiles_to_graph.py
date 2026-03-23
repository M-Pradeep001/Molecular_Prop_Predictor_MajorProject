"""
SMILES to Graph Conversion Utilities
Converts SMILES strings to PyTorch Geometric Data objects.
"""

import torch
from torch_geometric.data import Data
from rdkit import Chem
from rdkit.Chem import AllChem


def smiles_to_graph(smiles: str) -> Data:
    """
    Convert a SMILES string to a PyTorch Geometric Data object.
    
    Generates 3D coordinates using RDKit's ETKDG embedding and UFF optimization.
    
    Args:
        smiles: SMILES string representing a molecule
        
    Returns:
        Data object containing:
        - x: Node features [num_atoms, 11] (atomic_num + 10 padding)
        - pos: 3D coordinates [num_atoms, 3]
        - edge_index: Bond connectivity [2, num_edges*2]
        - batch: Batch assignment [num_atoms] (all zeros for single molecule)
        
    Raises:
        ValueError: If SMILES is invalid or 3D conformer generation fails
    """
    # Parse SMILES
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Invalid SMILES string: {smiles}")
    
    # Add explicit hydrogens
    mol = Chem.AddHs(mol)
    
    # Generate 3D conformer
    embed_result = AllChem.EmbedMolecule(mol, AllChem.ETKDG())
    if embed_result != 0:
        raise ValueError(f"Failed to generate 3D conformer for: {smiles}")
    
    # Optimize geometry
    AllChem.UFFOptimizeMolecule(mol)
    
    # Node features: atomic number + 10 padding zeros = 11 features
    atom_features = []
    for atom in mol.GetAtoms():
        feat = [atom.GetAtomicNum()] + [0] * 10
        atom_features.append(feat)
    
    x = torch.tensor(atom_features, dtype=torch.float)
    
    # 3D coordinates
    conf = mol.GetConformer()
    pos = []
    for i in range(mol.GetNumAtoms()):
        p = conf.GetAtomPosition(i)
        pos.append([p.x, p.y, p.z])
    
    pos = torch.tensor(pos, dtype=torch.float)
    
    # Edge index (undirected: both directions)
    edge_index = []
    for bond in mol.GetBonds():
        i = bond.GetBeginAtomIdx()
        j = bond.GetEndAtomIdx()
        edge_index.append([i, j])
        edge_index.append([j, i])
    
    edge_index = torch.tensor(edge_index).t().contiguous()
    
    # Create Data object with batch assignment for single molecule
    data = Data(x=x, pos=pos, edge_index=edge_index)
    data.batch = torch.zeros(x.size(0), dtype=torch.long)
    
    return data


def validate_smiles(smiles: str) -> bool:
    """Check if a SMILES string is valid."""
    mol = Chem.MolFromSmiles(smiles)
    return mol is not None
