import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Database, Atom, Beaker, Microscope, Hash, FileType } from 'lucide-react';

const ELEMENT_DATA = [
  { name: 'Carbon (C)', value: 36, count: 130000, color: '#909090' },
  { name: 'Hydrogen (H)', value: 54, count: 450000, color: '#FFFFFF' },
  { name: 'Oxygen (O)', value: 6, count: 50000, color: '#FF0D0D' },
  { name: 'Nitrogen (N)', value: 3, count: 25000, color: '#3050F8' },
  { name: 'Fluorine (F)', value: 1, count: 8000, color: '#90E050' },
];

const SIZE_DISTRIBUTION = [
  { range: '1-5 atoms', count: 5000 },
  { range: '6-9 atoms', count: 25000 },
  { range: '10-13 atoms', count: 45000 },
  { range: '14-17 atoms', count: 35000 },
  { range: '18-21 atoms', count: 15000 },
  { range: '22+ atoms', count: 5000 },
];

const DATASET_STATS = [
  {
    icon: <Hash className="w-6 h-6" />,
    value: '130,831',
    label: 'Total Molecules',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: <Atom className="w-6 h-6" />,
    value: '9.4',
    label: 'Avg Atoms/Mol',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: <Beaker className="w-6 h-6" />,
    value: '5',
    label: 'Elements (C,H,O,N,F)',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: <FileType className="w-6 h-6" />,
    value: '12',
    label: 'Target Properties',
    color: 'from-orange-500 to-amber-600',
  },
];

export function DatasetSection() {
  return (
    <section className="py-20 bg-white dark:bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <Database className="w-4 h-4" />
            Training Data
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QM9 Dataset
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The gold standard for molecular property prediction - 
            130,000+ organic molecules with DFT-calculated properties
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DATASET_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Element Composition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Element Composition
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Distribution of elements across all molecules
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ELEMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name.split(' ')[0]} ${value}%`}
                  >
                    {ELEMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Size Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Molecular Size Distribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Number of molecules by atom count
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SIZE_DISTRIBUTION} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    stroke="currentColor"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* About QM9 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Microscope className="w-6 h-6 text-purple-500" />
                About the Dataset
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-white">QM9</strong> is a comprehensive dataset 
                  of 134k stable small organic molecules made up of C, H, O, N, and F. 
                  Each molecule's geometry was optimized using Density Functional Theory (DFT) 
                  at the B3LYP/6-31G(2df,p) level.
                </p>
                <p>
                  The dataset includes 12 properties for each molecule, including electronic properties 
                  (HOMO, LUMO, gap), thermodynamic properties (enthalpy, free energy), 
                  and structural properties (dipole moment, polarizability).
                </p>
              </div>
            </div>
            <div className="md:w-72 space-y-3">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Source</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ramakrishnan et al., 2014</p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Calculation Method</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">DFT (B3LYP/6-31G*)</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">License</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CC BY 4.0</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
