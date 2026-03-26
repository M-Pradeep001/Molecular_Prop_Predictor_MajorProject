import { motion } from 'framer-motion';
import { ArrowRight, GitCommit, Share2, Box, Layers, Target, Atom, Rotate3D } from 'lucide-react';

const PIPELINE_STEPS = [
  { id: 1, title: 'SMILES Input',    description: 'Text representation of molecular structure',    icon: <GitCommit className="w-5 h-5" />, iconBg: 'bg-zinc-500' },
  { id: 2, title: 'Molecular Graph', description: 'Atoms as nodes, bonds as edges with features',  icon: <Share2 className="w-5 h-5" />,   iconBg: 'bg-brand-600' },
  { id: 3, title: '3D Conformer',    description: 'Spatial coordinates via RDKit ETKDG + UFF',   icon: <Box className="w-5 h-5" />,      iconBg: 'bg-gap-DEFAULT' },
  { id: 4, title: 'EGNN Layers',     description: '4-layer equivariant message passing (dim=128)', icon: <Layers className="w-5 h-5" />,   iconBg: 'bg-homo-DEFAULT' },
  { id: 5, title: 'Prediction',      description: 'HOMO, LUMO, Gap, Dipole, Polarizability',      icon: <Target className="w-5 h-5" />,   iconBg: 'bg-dipole-DEFAULT' },
];

const ARCH_ROWS = [
  ['Layers',       '4 EGNN layers'],
  ['Hidden Dim',   '128'],
  ['Activation',   'SiLU'],
  ['Readout',      'Global mean pool'],
  ['Training Set', '~100K molecules'],
];

export function ModelExplainer() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">From SMILES string to quantum properties in 5 steps</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Pipeline */}
          <div className="space-y-1">
            {PIPELINE_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${step.iconBg} flex items-center justify-center text-white`}>
                  {step.icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">Step {step.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{step.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{step.description}</p>
                </div>
                {/* Connector */}
                {index < PIPELINE_STEPS.length - 1 && (
                  <div className="absolute left-9 top-14 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" style={{ height: '1.5rem' }} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Info cards */}
          <div className="space-y-4">
            {/* E(3) Equivariance */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-homo-muted dark:bg-homo-DEFAULT/20 flex items-center justify-center">
                  <Rotate3D className="w-5 h-5 text-homo-DEFAULT dark:text-homo-light" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">E(3) Equivariance</h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Our model respects 3D space symmetries. Predictions are{' '}
                <strong className="text-zinc-900 dark:text-white">invariant</strong> to rotations and translations.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[['Rotation', <Atom className="w-4 h-4" />], ['Translation', <Box className="w-4 h-4" />]].map(([label, icon]) => (
                  <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <span className="text-gap-DEFAULT">{icon}</span>
                    <div>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
                      <p className="text-xs text-zinc-400">Same prediction</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Architecture</h3>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {ARCH_ROWS.map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{key}</span>
                    <span className="text-sm font-mono font-medium text-zinc-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Why EGNN callout */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border-l-4 border-brand-600 bg-brand-50 dark:bg-brand-600/10 p-5"
            >
              <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-1">Why EGNN?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Traditional GNNs ignore 3D geometry. EGNNs embed spatial coordinates directly, giving
                accurate predictions for properties that depend on molecular shape.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
