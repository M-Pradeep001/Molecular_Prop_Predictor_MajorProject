"""
Model Loading Utilities
Handles loading all trained EGNN models with their normalization parameters.
"""

import torch
from pathlib import Path
from .egnn_model import EGNNModel


class ModelLoader:
    """Manages loading and caching of all property prediction models."""
    
    # Model configuration: (filename, display_name, unit)
    MODEL_CONFIG = {
        'homo': ('homo.pt', 'HOMO', 'eV'),
        'lumo': ('lumo.pt', 'LUMO', 'eV'),
        'dipole': ('dipole.pt', 'Dipole Moment', 'Debye'),
        'gap': ('gap.pt', 'HOMO-LUMO Gap', 'eV'),
        'polar': ('polar.pt', 'Polarization', 'a.u.')
    }
    
    def __init__(self, weights_dir: str = 'weights'):
        self.weights_dir = Path(weights_dir)
        self._models = {}
        self._stats = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    def load_model(self, name: str) -> tuple[EGNNModel, float, float]:
        """
        Load a specific model by name.
        
        Args:
            name: Model key ('homo', 'lumo', 'dipole', 'gap', 'polar')
            
        Returns:
            tuple: (model, mean, std)
        """
        if name in self._models:
            return self._models[name], self._stats[name]['mean'], self._stats[name]['std']
        
        filename, _, _ = self.MODEL_CONFIG[name]
        checkpoint_path = self.weights_dir / filename
        
        if not checkpoint_path.exists():
            raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")
        
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        
        model = EGNNModel(node_dim=11).to(self.device)
        
        # Handle both checkpoint formats (with or without 'model_state_dict' key)
        state_dict = checkpoint.get("model_state_dict", checkpoint)
        model.load_state_dict(state_dict)
        model.eval()
        
        mean = checkpoint.get('mean', 0.0)
        std = checkpoint.get('std', 1.0)
        
        self._models[name] = model
        self._stats[name] = {'mean': mean, 'std': std}
        
        print(f"[INFO] Loaded {name} model from {checkpoint_path}")
        
        return model, mean, std
    
    def load_all(self) -> dict:
        """Load all available models."""
        for name in self.MODEL_CONFIG.keys():
            try:
                self.load_model(name)
            except FileNotFoundError:
                print(f"[WARNING] {name} model not found at {self.weights_dir / self.MODEL_CONFIG[name][0]}")
                continue
        return self._models
    
    def get_model_info(self, name: str) -> dict:
        """Get metadata for a model."""
        filename, display_name, unit = self.MODEL_CONFIG[name]
        return {
            'name': name,
            'display_name': display_name,
            'unit': unit,
            'filename': filename,
            'loaded': name in self._models
        }
    
    def list_models(self) -> list:
        """List all available model configurations."""
        return [self.get_model_info(name) for name in self.MODEL_CONFIG.keys()]


# Global loader instance
_loader = None
_loader_dir = None


def get_loader(weights_dir: str = 'weights') -> ModelLoader:
    """Get or create global ModelLoader instance."""
    global _loader, _loader_dir
    if _loader is None or _loader_dir != weights_dir:
        _loader = ModelLoader(weights_dir)
        _loader_dir = weights_dir
    return _loader
