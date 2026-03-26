import { motion } from 'framer-motion';
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const PROPERTY_CONFIG = {
  homo: {
    name: 'HOMO Energy',
    unit: 'eV',
    description: 'Highest Occupied Molecular Orbital — energy of the highest energy electron',
    range: { min: -11, max: -4 },
    qm9Range: { min: -10.5, max: -4.2 },
    accent: 'bg-homo',
    text: 'text-homo-DEFAULT dark:text-homo-light',
    badge: 'bg-homo/10 text-homo-DEFAULT dark:text-homo-light',
  },
  lumo: {
    name: 'LUMO Energy',
    unit: 'eV',
    description: 'Lowest Unoccupied Molecular Orbital — lowest energy level that can accept an electron',
    range: { min: -3, max: 3 },
    qm9Range: { min: -2.8, max: 2.5 },
    accent: 'bg-lumo',
    text: 'text-lumo-DEFAULT dark:text-lumo-light',
    badge: 'bg-lumo/10 text-lumo-DEFAULT dark:text-lumo-light',
  },
  gap: {
    name: 'HOMO-LUMO Gap',
    unit: 'eV',
    description: 'Energy difference between HOMO and LUMO — indicates reactivity and stability',
    range: { min: 0, max: 12 },
    qm9Range: { min: 1.2, max: 11.8 },
    accent: 'bg-gap',
    text: 'text-gap-DEFAULT dark:text-gap-light',
    badge: 'bg-gap/10 text-gap-DEFAULT dark:text-gap-light',
  },
  dipole: {
    name: 'Dipole Moment',
    unit: 'Debye',
    description: 'Measure of molecular polarity — separation of positive and negative charges',
    range: { min: 0, max: 12 },
    qm9Range: { min: 0, max: 11.5 },
    accent: 'bg-dipole',
    text: 'text-dipole-DEFAULT dark:text-dipole-light',
    badge: 'bg-dipole/10 text-dipole-DEFAULT dark:text-dipole-light',
  },
  polar: {
    name: 'Polarizability',
    unit: 'Bohr³',
    description: 'How easily the electron cloud distorts under an external electric field',
    range: { min: 0, max: 100 },
    qm9Range: { min: 40, max: 95 },
    accent: 'bg-polar',
    text: 'text-polar-DEFAULT dark:text-polar-light',
    badge: 'bg-polar/10 text-polar-DEFAULT dark:text-polar-light',
  },
};

function PropertyCard({ propertyKey, value }) {
  const cfg = PROPERTY_CONFIG[propertyKey];
  const [showTooltip, setShowTooltip] = useState(false);
  if (!cfg) return null;

  const normalized = Math.max(0, Math.min(1,
    (value - cfg.range.min) / (cfg.range.max - cfg.range.min)
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card card-hover relative overflow-visible"
    >
      {/* Left accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${cfg.accent}`} />

      <div className="pl-5 pr-4 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">{cfg.name}</p>
            <p className={`text-2xl font-bold tabular-nums ${cfg.text}`}>
              {value != null ? value.toFixed(3) : '—'}
              <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500 ml-1">{cfg.unit}</span>
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0 mt-0.5"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Range bar */}
        <div className="space-y-1.5">
          <div className="range-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${normalized * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`range-fill ${cfg.accent}`}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
            <span>{cfg.range.min}</span>
            <span className={`font-medium ${cfg.text}`}>{(normalized * 100).toFixed(0)}% of range</span>
            <span>{cfg.range.max}</span>
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute top-full left-0 right-0 mt-2 z-20 card p-4 shadow-card-md"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-3 right-3 p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 pr-5">{cfg.description}</p>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                QM9 range: {cfg.qm9Range.min} – {cfg.qm9Range.max} {cfg.unit}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { AnimatePresence } from 'framer-motion';

export function ResultsDashboard({ result }) {
  if (!result || !result.properties) {
    return (
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading mb-3">Results Dashboard</h2>
          <p className="section-subheading">Predict molecular properties to see detailed analysis here</p>
        </div>
      </section>
    );
  }

  const props = result.properties;

  return (
    <section id="results" className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-heading">Prediction Results</h2>
          <p className="section-subheading">
            Quantum properties for{' '}
            <code className="text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-600/10 px-1.5 py-0.5 rounded text-sm font-mono">
              {result.smiles}
            </code>
          </p>
        </motion.div>

        {/* Property cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.keys(PROPERTY_CONFIG).map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <PropertyCard propertyKey={key} value={props[key]} />
            </motion.div>
          ))}

          {/* Quick Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="card p-5"
          >
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Quick Summary</p>
            <div className="space-y-3">
              {[
                { label: 'Stability',  value: props.gap > 5 ? 'High' : 'Moderate', cls: props.gap > 5 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
                { label: 'Polarity',   value: props.dipole > 3 ? 'Polar' : 'Non-polar', cls: props.dipole > 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
                { label: 'Reactivity', value: props.gap < 3 ? 'High' : 'Low', cls: props.gap < 3 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.cls}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
