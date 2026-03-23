import { motion } from 'framer-motion';
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const PROPERTY_CONFIG = {
  homo: {
    name: 'HOMO Energy',
    unit: 'eV',
    color: 'homo',
    description: 'Highest Occupied Molecular Orbital - represents the energy of the highest energy electron in the molecule',
    range: { min: -11, max: -4 },
    qm9Range: { min: -10.5, max: -4.2 },
  },
  lumo: {
    name: 'LUMO Energy',
    unit: 'eV',
    color: 'lumo',
    description: 'Lowest Unoccupied Molecular Orbital - represents the lowest energy level that can accept an electron',
    range: { min: -3, max: 3 },
    qm9Range: { min: -2.8, max: 2.5 },
  },
  gap: {
    name: 'HOMO-LUMO Gap',
    unit: 'eV',
    color: 'gap',
    description: 'Energy difference between HOMO and LUMO - indicates chemical reactivity and stability',
    range: { min: 0, max: 12 },
    qm9Range: { min: 1.2, max: 11.8 },
  },
  dipole: {
    name: 'Dipole Moment',
    unit: 'Debye',
    color: 'dipole',
    description: 'Measure of molecular polarity - indicates the separation of positive and negative charges',
    range: { min: 0, max: 12 },
    qm9Range: { min: 0, max: 11.5 },
  },
  polar: {
    name: 'Polarizability',
    unit: 'Bohr³',
    color: 'polar',
    description: 'Measure of how easily the electron cloud can be distorted by an external electric field',
    range: { min: 0, max: 100 },
    qm9Range: { min: 40, max: 95 },
  },
};

function PropertyCard({ propertyKey, value }) {
  const config = PROPERTY_CONFIG[propertyKey];
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!config) return null;

  const normalizedValue = Math.max(0, Math.min(1, 
    (value - config.range.min) / (config.range.max - config.range.min)
  ));

  const colorClasses = {
    homo: { bg: 'bg-homo/10', text: 'text-homo', fill: 'bg-homo', border: 'border-homo/20' },
    lumo: { bg: 'bg-lumo/10', text: 'text-lumo', fill: 'bg-lumo', border: 'border-lumo/20' },
    gap: { bg: 'bg-gap/10', text: 'text-gap', fill: 'bg-gap', border: 'border-gap/20' },
    dipole: { bg: 'bg-dipole/10', text: 'text-dipole', fill: 'bg-dipole', border: 'border-dipole/20' },
    polar: { bg: 'bg-polar/10', text: 'text-polar', fill: 'bg-polar', border: 'border-polar/20' },
  }[config.color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative glass rounded-2xl p-6 ${colorClasses.bg} border ${colorClasses.border} card-hover`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {config.name}
          </h3>
          <p className={`text-sm ${colorClasses.text} font-medium`}>
            {value?.toFixed(3) || '--'} {config.unit}
          </p>
        </div>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 bg-navy-800 rounded-xl shadow-xl z-10 text-sm text-gray-300"
        >
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <p>{config.description}</p>
          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
            QM9 Range: {config.qm9Range.min} - {config.qm9Range.max} {config.unit}
          </div>
        </motion.div>
      )}

      {/* Range Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{config.range.min}</span>
          <span>{config.range.max}</span>
        </div>
        <div className="range-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${normalizedValue * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`range-fill ${colorClasses.fill}`}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Min</span>
          <span className={`font-medium ${colorClasses.text}`}>
            Value: {((normalizedValue * 100)).toFixed(1)}% of range
          </span>
          <span className="text-gray-500">Max</span>
        </div>
      </div>

      {/* QM9 Indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Within QM9 dataset range</span>
        </div>
      </div>
    </motion.div>
  );
}

export function ResultsDashboard({ result }) {
  if (!result || !result.properties) {
    return (
      <section id="results" className="py-20 bg-white dark:bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Results Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Predict molecular properties to see detailed analysis here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="py-20 bg-white dark:bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Prediction Results
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Quantum chemical properties for <span className="font-mono text-blue-500">{result.smiles}</span>
          </p>
        </motion.div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(PROPERTY_CONFIG).map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard propertyKey={key} value={result.properties[key]} />
            </motion.div>
          ))}
          
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Stability</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.properties.gap > 5 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {result.properties.gap > 5 ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Polarity</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.properties.dipole > 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {result.properties.dipole > 3 ? 'Polar' : 'Non-polar'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reactivity</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.properties.gap < 3 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {result.properties.gap < 3 ? 'High' : 'Low'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
