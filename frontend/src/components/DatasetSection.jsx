import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Database, Atom, Beaker, FileType, Microscope } from 'lucide-react';

const ELEMENT_DATA = [
  { name: 'Carbon (C)',   value: 36, color: '#71717a' },
  { name: 'Hydrogen (H)', value: 54, color: '#d4d4d8' },
  { name: 'Oxygen (O)',   value: 6,  color: '#ef4444' },
  { name: 'Nitrogen (N)', value: 3,  color: '#3b82f6' },
  { name: 'Fluorine (F)', value: 1,  color: '#22c55e' },
];

const SIZE_DISTRIBUTION = [
  { range: '1-5',   count: 5000 },
  { range: '6-9',   count: 25000 },
  { range: '10-13', count: 45000 },
  { range: '14-17', count: 35000 },
  { range: '18-21', count: 15000 },
  { range: '22+',   count: 5000 },
];

const STATS = [
  { icon: <Database className="w-5 h-5" />, value: '130,831', label: 'Total Molecules',     iconBg: 'bg-brand-100 dark:bg-brand-600/20',            iconClr: 'text-brand-600 dark:text-brand-400' },
  { icon: <Atom className="w-5 h-5" />,     value: '9.4',     label: 'Avg Atoms / Mol',     iconBg: 'bg-homo-muted dark:bg-homo-DEFAULT/20',         iconClr: 'text-homo-DEFAULT dark:text-homo-light' },
  { icon: <Beaker className="w-5 h-5" />,   value: '5',       label: 'Elements (C,H,O,N,F)', iconBg: 'bg-gap-muted dark:bg-gap-DEFAULT/20',           iconClr: 'text-gap-DEFAULT dark:text-gap-light' },
  { icon: <FileType className="w-5 h-5" />, value: '12',      label: 'Target Properties',   iconBg: 'bg-dipole-muted dark:bg-dipole-DEFAULT/20',     iconClr: 'text-dipole-DEFAULT dark:text-dipole-light' },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#e4e4e7',
  fontSize: '12px',
};

export function DatasetSection() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-600/10 border border-brand-200 dark:border-brand-600/30 text-brand-700 dark:text-brand-400 text-xs font-medium mb-4">
            <Database className="w-3.5 h-3.5" />
            Training Data
          </div>
          <h2 className="section-heading">QM9 Dataset</h2>
          <p className="section-subheading max-w-xl">
            The gold standard for molecular property prediction — 130K+ organic molecules with DFT-calculated properties
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card card-hover p-5"
            >
              <div className={`w-9 h-9 rounded-lg ${s.iconBg} ${s.iconClr} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Element Composition</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Distribution across all molecules</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ELEMENT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name.split(' ')[0]} ${value}%`} labelLine={false}>
                    {ELEMENT_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Molecular Size Distribution</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Molecules by heavy atom count</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SIZE_DISTRIBUTION} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.2)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(161,161,170,0.05)' }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* About QM9 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-zinc-400" /> About the Dataset
              </h3>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <strong className="text-zinc-900 dark:text-white">QM9</strong> is a comprehensive dataset of 134k stable small organic molecules made up of C, H, O, N, and F, with geometries optimized via DFT at the B3LYP/6-31G(2df,p) level.
                </p>
                <p>
                  Includes 12 properties per molecule: electronic (HOMO, LUMO, gap), thermodynamic (enthalpy, free energy), and structural (dipole, polarizability).
                </p>
              </div>
            </div>
            <div className="md:w-64 space-y-2">
              {[
                ['Source',             'Ramakrishnan et al., 2014', 'border-brand-500'],
                ['Calculation Method', 'DFT (B3LYP/6-31G*)',        'border-gap-DEFAULT'],
                ['License',            'CC BY 4.0',                  'border-homo-DEFAULT'],
              ].map(([label, val, border]) => (
                <div key={label} className={`rounded-lg border-l-2 ${border} bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5`}>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
