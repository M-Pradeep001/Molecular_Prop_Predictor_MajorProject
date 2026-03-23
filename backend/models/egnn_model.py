"""
EGNN Model Architecture for Molecular Property Prediction
Clean model definition for backend inference.
"""

import torch
import torch.nn as nn
from torch_geometric.nn import global_mean_pool


class EGNNLayer(nn.Module):
    """
    E(n) Equivariant Graph Neural Network Layer.
    Maintains E(n) equivariance with respect to coordinate transformations.
    """
    
    def __init__(self, feat_dim: int):
        super().__init__()
        
        self.edge_mlp = nn.Sequential(
            nn.Linear(feat_dim * 2 + 1, 128),
            nn.SiLU(),
            nn.Linear(128, 128),
            nn.SiLU()
        )
        
        self.node_mlp = nn.Sequential(
            nn.Linear(feat_dim + 128, feat_dim),
            nn.SiLU()
        )
        
        self.coord_mlp = nn.Sequential(
            nn.Linear(128, 1),
            nn.Tanh()
        )
    
    def forward(self, x: torch.Tensor, pos: torch.Tensor, edge_index: torch.Tensor):
        """Forward pass of EGNN layer."""
        row, col = edge_index
        
        dist2 = ((pos[row] - pos[col]) ** 2).sum(dim=1, keepdim=True)
        edge_feat = torch.cat([x[row], x[col], dist2], dim=1)
        m_ij = self.edge_mlp(edge_feat)
        
        coord_update = (pos[row] - pos[col]) * self.coord_mlp(m_ij)
        coord_agg = torch.zeros_like(pos)
        coord_agg = coord_agg.index_add(0, row, coord_update)
        pos = pos + coord_agg
        
        agg = torch.zeros_like(x)
        agg = agg.index_add(0, row, m_ij)
        
        x = self.node_mlp(torch.cat([x, agg], dim=1))
        
        return x, pos


class EGNNModel(nn.Module):
    """
    E(n) Equivariant Graph Neural Network.
    
    Architecture:
    - 4 EGNN layers (hidden_dim=128)
    - SiLU activation
    - Dropout(0.1) in MLP head
    """
    
    def __init__(self, node_dim: int = 11):
        super().__init__()
        
        self.embedding = nn.Linear(node_dim, 128)
        
        self.layers = nn.ModuleList([
            EGNNLayer(128),
            EGNNLayer(128),
            EGNNLayer(128),
            EGNNLayer(128)
        ])
        
        self.head = nn.Sequential(
            nn.Linear(128, 128),
            nn.SiLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 1)
        )
    
    def forward(self, data) -> torch.Tensor:
        """
        Forward pass.
        
        Args:
            data: PyG Data with x, pos, edge_index, batch
            
        Returns:
            Predicted value [batch_size]
        """
        x = self.embedding(data.x.float())
        pos = data.pos
        
        for layer in self.layers:
            x, pos = layer(x, pos, data.edge_index)
        
        x = global_mean_pool(x, data.batch)
        return self.head(x).squeeze(-1)
