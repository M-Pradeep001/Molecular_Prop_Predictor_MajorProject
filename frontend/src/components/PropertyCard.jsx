const propertyConfig = {
  homo: {
    name: 'HOMO Energy',
    unit: 'eV',
    description: 'Highest Occupied Molecular Orbital',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  lumo: {
    name: 'LUMO Energy',
    unit: 'eV',
    description: 'Lowest Unoccupied Molecular Orbital',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
  },
  gap: {
    name: 'HOMO-LUMO Gap',
    unit: 'eV',
    description: 'Energy difference between HOMO and LUMO',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
  },
  dipole: {
    name: 'Dipole Moment',
    unit: 'Debye',
    description: 'Molecular polarity measure',
    color: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  polar: {
    name: 'Polarizability',
    unit: 'a.u.',
    description: 'Electron cloud deformability',
    color: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
  },
};

export default function PropertyCard({ propertyKey, value }) {
  const config = propertyConfig[propertyKey];

  if (!config) return null;

  return (
    <div className={`p-5 rounded-xl border ${config.color} transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {config.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {config.description}
          </p>
        </div>
        <span className={`text-2xl font-bold ${config.iconColor}`}>
          {typeof value === 'number' ? value.toFixed(4) : value}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200/50">
        <span className="text-sm text-gray-500 font-medium">
          Unit: {config.unit}
        </span>
      </div>
    </div>
  );
}
