import { motion } from 'framer-motion';
import { ArrowRight, GitCommit, Share2, Box, Layers, Target, Atom, Rotate3D } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 1,
    title: 'SMILES Input',
    description: 'Simplified Molecular Input Line Entry System',
    icon: <GitCommit className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    detail: 'Text representation of molecular structure',
  },
  {
    id: 2,
    title: 'Molecular Graph',
    description: 'Atoms as nodes, bonds as edges',
    icon: <Share2 className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    detail: 'Graph representation with node/edge features',
  },
  {
    id: 3,
    title: '3D Conformer',
    description: 'Spatial coordinates via RDKit',
    icon: <Box className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    detail: '3D coordinates + atom features (x, y, z, element)',
  },
  {
    id: 4,
    title: 'EGNN Layers',
    description: '4-layer message passing',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    detail: 'E(3) Equivariant Graph Neural Network',
  },
  {
    id: 5,
    title: 'Prediction',
    description: '5 quantum properties',
    icon: <Target className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    detail: 'HOMO, LUMO, Gap, Dipole, Polarizability',
  },
];

function PipelineStep({ step, index, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className={`relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-white/10 to-transparent border border-white/20' 
          : 'hover:bg-white/5'
      }`}
    >
      {/* Step Number */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
        {step.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500">Step {step.id}</span>
          {isActive && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
              Processing
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {step.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {step.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
          {step.detail}
        </p>
      </div>

      {/* Arrow */}
      {index < PIPELINE_STEPS.length - 1 && (
        <div className="absolute -bottom-4 left-6 text-gray-400">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      )}
    </motion.div>
  );
}

export function ModelExplainer() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From SMILES string to quantum properties in 5 steps
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Pipeline Steps */}
          <div className="space-y-6">
            {PIPELINE_STEPS.map((step, index) => (
              <PipelineStep
                key={step.id}
                step={step}
                index={index}
                isActive={false}
              />
            ))}
          </div>

          {/* Key Concept Cards */}
          <div className="space-y-6">
            {/* E(3) Equivariance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Rotate3D className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  E(3) Equivariance
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Our model respects the symmetries of 3D space. Predictions remain 
                <strong className="text-purple-400"> invariant </strong> 
                to rotations and translations of the molecule.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <Atom className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-sm text-gray-400">Rotation</p>
                  <p className="text-xs text-gray-500">Same prediction</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <Box className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-sm text-gray-400">Translation</p>
                  <p className="text-xs text-gray-500">Same prediction</p>
                </div>
              </div>
            </motion.div>

            {/* Architecture Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Model Architecture
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                  <span className="text-gray-400">Layers</span>
                  <span className="text-white font-mono">4 EGNN layers</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                  <span className="text-gray-400">Hidden Dim</span>
                  <span className="text-white font-mono">128</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                  <span className="text-gray-400">Activation</span>
                  <span className="text-white font-mono">SiLU</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                  <span className="text-gray-400">Training Set</span>
                  <span className="text-white font-mono">~100K molecules</span>
                </div>
              </div>
            </motion.div>

            {/* Key Innovation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Why EGNN?
              </h3>
              <p className="text-sm text-gray-300">
                Traditional GNNs treat molecular graphs without considering 3D geometry. 
                EGNNs incorporate spatial coordinates directly, enabling accurate prediction 
                of quantum properties that depend on molecular shape.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
