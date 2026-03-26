import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, Code2, Database, GitBranch, Layers, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1, title: 'Multi-Task Learning Failed', status: 'resolved', icon: <Layers className="w-5 h-5" />,
    description: 'Predicting all 5 properties with a single model resulted in poor performance on chemically diverse molecules.',
    solution: 'Switched to single-task models — one EGNN per property — improving accuracy by 23%.',
  },
  {
    id: 2, title: 'Model Loading Issues', status: 'resolved', icon: <Code2 className="w-5 h-5" />,
    description: 'PyTorch models failed in production due to device mismatch (CUDA vs CPU) and path issues.',
    solution: 'Device-agnostic loading with CPU fallback. Robust path handling using pathlib.',
  },
  {
    id: 3, title: 'SMILES Validation Edge Cases', status: 'resolved', icon: <AlertTriangle className="w-5 h-5" />,
    description: 'RDKit accepts some invalid SMILES that cause downstream failures in graph construction.',
    solution: 'Multi-layer validation: RDKit parsing, sanitization check, and conformer generation test.',
  },
  {
    id: 4, title: '3D Conformer Generation', status: 'resolved', icon: <Database className="w-5 h-5" />,
    description: 'Some molecules require multiple attempts to generate valid 3D conformers via ETKDG.',
    solution: 'Retry logic with increasing maxAttempts and fallback to random coordinates.',
  },
  {
    id: 5, title: 'Dataset Limitations', status: 'mitigated', icon: <GitBranch className="w-5 h-5" />,
    description: 'QM9 only covers small organic molecules (≤9 heavy atoms). Model fails on larger inputs.',
    solution: 'Documented OOD behavior. Implemented warnings for molecules outside training distribution.',
  },
];

const LEARNINGS = [
  { title: 'Equivariance Matters',    description: 'EGNN outperformed standard GNN by 15% on energy predictions due to proper 3D symmetry handling.' },
  { title: 'Normalization Strategy', description: 'Property-specific normalization was critical — different properties span vastly different scales (eV vs Debye).' },
  { title: 'Inference Optimization', description: 'Batch prediction with proper padding cut average inference time from 2.3s to 0.8s per molecule.' },
];

const TECH_TAGS = ['PyTorch', 'PyTorch Geometric', 'RDKit', 'Flask', 'React', 'Tailwind', 'Framer Motion'];

function ChallengeCard({ challenge, index }) {
  const resolved = challenge.status === 'resolved';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="card p-5"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${resolved ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{challenge.title}</h3>
            <span className={`badge ${resolved ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
              {resolved ? <><CheckCircle2 className="w-3 h-3" /> Resolved</> : <><XCircle className="w-3 h-3" /> Mitigated</>}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{challenge.description}</p>
          <div className="flex items-start gap-2 rounded-lg border-l-2 border-brand-600 bg-brand-50 dark:bg-brand-600/10 px-3 py-2">
            <Lightbulb className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-700 dark:text-zinc-300"><strong className="text-brand-700 dark:text-brand-400">Solution: </strong>{challenge.solution}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EngineeringInsights() {
  return (
    <section id="insights" className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-heading">Engineering Insights</h2>
          <p className="section-subheading">Real challenges faced and lessons learned building this system</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Challenges */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Challenges & Solutions
            </h3>
            {CHALLENGES.map((c, i) => <ChallengeCard key={c.id} challenge={c} index={i} />)}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Key Learnings
            </h3>
            {LEARNINGS.map((l, i) => (
              <motion.div
                key={l.title}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-4"
              >
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{l.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{l.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-4"
            >
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {TECH_TAGS.map((t) => (
                  <span key={t} className="px-2.5 py-1 text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {t}
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
