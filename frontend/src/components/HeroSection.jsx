import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Atom } from 'lucide-react';

const EXAMPLE_MOLECULES = [
  { name: 'Benzene',  smiles: 'c1ccccc1' },
  { name: 'Ethanol',  smiles: 'CCO' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Aspirin',  smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
];

export function HeroSection({ onPredict, isLoading }) {
  const [smiles, setSmiles] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[HeroSection] Submit clicked, smiles:', smiles);
    if (smiles.trim()) {
      console.log('[HeroSection] Calling onPredict with:', smiles.trim());
      onPredict(smiles.trim());
    } else {
      console.log('[HeroSection] SMILES is empty, not calling onPredict');
    }
  };

  const handleExampleClick = (s) => {
    console.log('[HeroSection] Example clicked:', s);
    setSmiles(s);
    onPredict(s);
  };

  return (
    <section className="relative min-h-screen flex pt-14">
      {/* Left side - Coal dark background with content */}
      <div className="flex-1 bg-black flex items-start justify-center pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle dot grid background */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

          {/* Soft gradient overlays */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />



        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight"
        >
          Predict Molecular{' '}
          <span className="text-gray-400">Properties</span>
          {' '}Instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-6 font-medium"
        >
          A Framework for Chemically-Informed Model Training
        </motion.p>



        {/* Input form */}
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          onSubmit={handleSubmit}
          className="mb-6"
        >
          <div className={`flex items-center gap-2 p-1.5 bg-gray-900 rounded-xl border border-gray-600 transition-all duration-150 shadow-card ${
            isFocused
              ? 'border-gray-400 ring-2 ring-gray-400/20'
              : 'border-gray-600'
          }`}>
            <input
              type="text"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter SMILES string  (e.g. CCO for ethanol)"
              className="flex-1 bg-transparent px-3 py-2.5 text-gray-200 placeholder-gray-500 outline-none text-sm font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !smiles.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline text-sm">Running…</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Predict</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Example chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-gray-500">Try:</span>
          {EXAMPLE_MOLECULES.map((mol) => (
            <button
              key={mol.name}
              onClick={() => handleExampleClick(mol.smiles)}
              className="px-3 py-1 rounded-full border border-gray-800 bg-gray-900 text-xs font-medium text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors"
            >
              {mol.name}
            </button>
          ))}
        </motion.div>
        </div>
      </div>
      
      {/* Right side - Image panel */}
      <div className="w-1/3 lg:w-2/5 bg-black relative overflow-hidden">
        <img 
          src="/images/tuxpi.com.1776104658 (1).jpg" 
          alt="Chemistry background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </section>
  );
}
