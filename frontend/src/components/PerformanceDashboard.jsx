import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine, Cell } from 'recharts';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

const RMSE_DATA = [
  { property: 'HOMO',   rmse: 0.047, color: '#7c3aed' },
  { property: 'LUMO',   rmse: 0.046, color: '#2563eb' },
  { property: 'Gap',    rmse: 0.063, color: '#059669' },
  { property: 'Dipole', rmse: 0.297, color: '#d97706' },
  { property: 'Polar',  rmse: 0.060, color: '#db2777' },
];

const SCATTER_DATA = [
  { actual: -5.5, predicted: -5.52, count: 5 },
  { actual: -6.0, predicted: -5.98, count: 8 },
  { actual: -6.5, predicted: -6.48, count: 12 },
  { actual: -7.0, predicted: -7.02, count: 15 },
  { actual: -7.5, predicted: -7.48, count: 10 },
  { actual: -8.0, predicted: -8.05, count: 7 },
  { actual: -8.5, predicted: -8.52, count: 4 },
  { actual: -9.0, predicted: -8.95, count: 3 },
];

const METRICS = [
  { label: 'R² Score',         value: '0.90', unit: '',    description: 'Coefficient of determination', icon: <Target className="w-5 h-5" />,    iconBg: 'bg-green-100 dark:bg-green-900/30',   iconClr: 'text-green-600 dark:text-green-400' },
  { label: 'Avg RMSE',         value: '0.19', unit: 'eV', description: 'Root Mean Square Error',        icon: <TrendingUp className="w-5 h-5" />, iconBg: 'bg-brand-100 dark:bg-brand-600/20',   iconClr: 'text-brand-600 dark:text-brand-400' },
  { label: 'MAE',              value: '0.14', unit: 'eV', description: 'Mean Absolute Error',           icon: <BarChart3 className="w-5 h-5" />,  iconBg: 'bg-homo-muted dark:bg-homo-DEFAULT/20', iconClr: 'text-homo-DEFAULT dark:text-homo-light' },
  { label: 'Test Molecules',   value: '13K',  unit: '',   description: 'Held-out test set size',        icon: <Award className="w-5 h-5" />,      iconBg: 'bg-dipole-muted dark:bg-dipole-DEFAULT/20', iconClr: 'text-dipole-DEFAULT dark:text-dipole-light' },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#e4e4e7',
  fontSize: '12px',
};

export function PerformanceDashboard() {
  return (
    <section id="performance" className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-heading">Model Performance</h2>
          <p className="section-subheading">Benchmarked on QM9 holdout set</p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card card-hover p-5"
            >
              <div className={`w-9 h-9 rounded-lg ${m.iconBg} ${m.iconClr} flex items-center justify-center mb-3`}>
                {m.icon}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{m.label}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{m.value}</span>
                {m.unit && <span className="text-sm text-zinc-400">{m.unit}</span>}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{m.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">RMSE by Property</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Lower RMSE = better accuracy</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RMSE_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.2)" vertical={false} />
                  <XAxis dataKey="property" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'RMSE', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(161,161,170,0.05)' }} />
                  <Bar dataKey="rmse" radius={[4, 4, 0, 0]}>
                    {RMSE_DATA.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Predicted vs Actual (HOMO)</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Blue line = perfect prediction (y = x)</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.2)" />
                  <XAxis type="number" dataKey="actual" name="Actual" domain={[-10, -5]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Actual (eV)', position: 'bottom', fill: '#a1a1aa', fontSize: 11 }} />
                  <YAxis type="number" dataKey="predicted" name="Predicted" domain={[-10, -5]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Predicted (eV)', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 11 }} />
                  <ZAxis type="number" dataKey="count" range={[30, 300]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <ReferenceLine segment={[{ x: -10, y: -10 }, { x: -5, y: -5 }]} stroke="#4f46e5" strokeWidth={1.5} />
                  <Scatter data={SCATTER_DATA} fill="#4f46e5" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Summary row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 card p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Model Comparison</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
                Our EGNN outperforms traditional ML (Random Forest, SVM) and matches state-of-the-art Transformer-based models — while being 10× faster at inference.
              </p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              {[['SOTA', 'Performance', 'text-zinc-900 dark:text-white'], ['10×', 'Faster', 'text-green-600 dark:text-green-400'], ['5', 'Properties', 'text-brand-600 dark:text-brand-400']].map(([val, lbl, cls]) => (
                <div key={lbl} className="text-center">
                  <p className={`text-2xl font-bold ${cls}`}>{val}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
