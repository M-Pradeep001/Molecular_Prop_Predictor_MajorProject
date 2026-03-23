import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, Code2, Database, GitBranch, Layers, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: 'Multi-Task Learning Failed',
    description: 'Initial attempts to predict all 5 properties with a single model resulted in poor performance on chemically diverse molecules.',
    solution: 'Switched to single-task models - one EGNN per property, improving accuracy by 23%.',
    icon: <Layers className="w-6 h-6" />,
    type: 'architecture',
    status: 'resolved',
  },
  {
    id: 2,
    title: 'Model Loading Issues',
    description: 'PyTorch models failed to load in production due to device mismatch (CUDA vs CPU) and path resolution issues.',
    solution: 'Implemented device-agnostic loading with fallback to CPU. Added robust path handling using pathlib.',
    icon: <Code2 className="w-6 h-6" />,
    type: 'engineering',
    status: 'resolved',
  },
  {
    id: 3,
    title: 'SMILES Validation Edge Cases',
    description: 'RDKit accepts invalid SMILES that cause downstream failures in graph construction.',
    solution: 'Added multi-layer validation: RDKit parsing, sanitization check, and conformer generation test.',
    icon: <AlertTriangle className="w-6 h-6" />,
    type: 'data',
    status: 'resolved',
  },
  {
    id: 4,
    title: '3D Conformer Generation',
    description: 'Some molecules require multiple attempts to generate valid 3D conformers with ETKDG.',
    solution: 'Implemented retry logic with increasing maxAttempts. Added fallback to random coordinates.',
    icon: <Database className="w-6 h-6" />,
    type: 'data',
    status: 'resolved',
  },
  {
    id: 5,
    title: 'Dataset Limitations',
    description: 'QM9 only contains small organic molecules (up to 9 heavy atoms). Model fails on larger molecules.',
    solution: 'Documented OOD detection. Implemented warnings for molecules outside training distribution.',
    icon: <GitBranch className="w-6 h-6" />,
    type: 'scope',
    status: 'mitigated',
  },
];

const LEARNINGS = [
  {
    title: 'Equivariance Matters',
    description: 'EGNN outperformed standard GNN by 15% on energy predictions due to proper handling of 3D symmetries.',
  },
  {
    title: 'Normalization Strategy',
    description: 'Property-specific normalization was critical. Different properties have vastly different scales (eV vs Debye).',
  },
  {
    title: 'Inference Optimization',
    description: 'Batch prediction with proper padding reduced average inference time from 2.3s to 0.8s per molecule.',
  },
];

function ChallengeCard({ challenge, index }) {
  const isResolved = challenge.status === 'resolved';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-6 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          isResolved 
            ? 'bg-green-500/20 text-green-500' 
            : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {challenge.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {challenge.title}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              isResolved 
                ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
            }`}>
              {isResolved ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Mitigated
                </span>
              )}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {challenge.description}
          </p>
          
          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-blue-600 dark:text-blue-400">Solution: </strong>
              {challenge.solution}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EngineeringInsights() {
  return (
    <section id="insights" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-navy-900 dark:to-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Engineering Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real challenges faced and lessons learned building this system
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Challenges Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Challenges & Solutions
            </h3>
            {CHALLENGES.map((challenge, index) => (
              <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
            ))}
          </div>

          {/* Learnings Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Key Learnings
            </h3>
            
            {LEARNINGS.map((learning, index) => (
              <motion.div
                key={learning.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-5 card-hover"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {learning.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {learning.description}
                </p>
              </motion.div>
            ))}

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-5"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'PyTorch Geometric', 'RDKit', 'Flask', 'React', 'Tailwind', 'Framer Motion'].map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 text-xs font-medium bg-white/50 dark:bg-white/10 rounded-full text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
