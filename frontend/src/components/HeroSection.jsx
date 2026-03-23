import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Atom, Sparkles, Zap } from 'lucide-react';

const EXAMPLE_MOLECULES = [
  { name: 'Benzene', smiles: 'c1ccccc1', icon: '⬡' },
  { name: 'Ethanol', smiles: 'CCO', icon: '🍷' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', icon: '☕' },
  { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O', icon: '💊' },
];

export function HeroSection({ onPredict, isLoading }) {
  const [smiles, setSmiles] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (smiles.trim()) {
      onPredict(smiles.trim());
    }
  };

  const handleExampleClick = (exampleSmiles) => {
    setSmiles(exampleSmiles);
    onPredict(exampleSmiles);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
            }}
            animate={{ 
              y: [null, -30, 30],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white/90">
            AI-Powered Quantum Chemistry
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
            v2.0
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow"
        >
          Molecular Property
          <br />
          <span className="gradient-text">Prediction</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-4"
        >
          Predict quantum chemical properties in seconds using our advanced
          Equivariant Graph Neural Network trained on 130,000+ molecules.
        </motion.p>

        {/* EGNN Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-12"
        >
          <span className="flex items-center gap-1">
            <Atom className="w-4 h-4" />
            E(3) Equivariant
          </span>
          <span className="w-1 h-1 bg-gray-500 rounded-full" />
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            QM9 Dataset
          </span>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-8"
        >
          <div 
            className={`relative flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-lg border transition-all duration-300 ${
              isFocused ? 'border-blue-400 shadow-lg shadow-blue-500/25' : 'border-white/20'
            }`}
          >
            <input
              type="text"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter SMILES string (e.g., CCO for ethanol)"
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none text-lg"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !smiles.trim()}
              className="glow-button px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Running...</span>
                </>
              ) : (
                <>
                  <span>Predict</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Example Chips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-sm text-gray-400 mr-2">Try examples:</span>
          {EXAMPLE_MOLECULES.map((mol, index) => (
            <motion.button
              key={mol.name}
              onClick={() => handleExampleClick(mol.smiles)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <span>{mol.icon}</span>
              {mol.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
