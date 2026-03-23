import React, { useState } from 'react';

export default function SmilesInput({ onSubmit, disabled }) {
  const [smiles, setSmiles] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (smiles.trim()) {
      onSubmit(smiles.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={smiles}
          onChange={(e) => setSmiles(e.target.value)}
          placeholder="Enter SMILES string (e.g., CCO for ethanol)"
          disabled={disabled}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={disabled || !smiles.trim()}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? 'Predicting...' : 'Predict'}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Example: CCO (ethanol), CC(=O)O (acetic acid), c1ccccc1 (benzene)
      </p>
    </form>
  );
}
