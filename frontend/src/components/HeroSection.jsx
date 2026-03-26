import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Atom, Zap } from 'lucide-react';

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
    if (smiles.trim()) onPredict(smiles.trim());
  };

  const handleExampleClick = (s) => {
    setSmiles(s);
    onPredict(s);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#09090b] pt-14">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 dark:opacity-40" />

      {/* Soft top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-50 dark:from-[#09090b] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-50 dark:from-[#09090b] to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">



        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 leading-tight"
        >
          Predict Molecular{' '}
          <span className="text-brand-600 dark:text-brand-400">Properties</span>
          {' '}Instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-2 font-medium"
        >
          A Framework for Chemically-Informed Model Training
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8"
        >
          Predict quantum-chemical properties (HOMO, LUMO, Gap, Dipole, Polarizability)
          directly from SMILES using our equivariant EGNN architecture.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-10"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-500" /> 5 properties
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span>130K training molecules</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span>QM9 dataset</span>
        </motion.div>

        {/* Input form */}
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          onSubmit={handleSubmit}
          className="mb-6"
        >
          <div className={`flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-150 shadow-card ${
            isFocused
              ? 'border-brand-500 ring-2 ring-brand-500/20'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}>
            <input
              type="text"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter SMILES string  (e.g. CCO for ethanol)"
              className="flex-1 bg-transparent px-3 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none text-sm font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !smiles.trim()}
              className="btn-primary flex-shrink-0"
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
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Try:</span>
          {EXAMPLE_MOLECULES.map((mol) => (
            <button
              key={mol.name}
              onClick={() => handleExampleClick(mol.smiles)}
              className="px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {mol.name}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
