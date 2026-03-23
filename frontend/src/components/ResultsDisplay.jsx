import PropertyCard from './PropertyCard';

export default function ResultsDisplay({ smiles, properties }) {
  const propertyKeys = ['homo', 'lumo', 'gap', 'dipole', 'polar'];

  return (
    <div className="mt-8">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Input Molecule
        </h3>
        <p className="mt-1 text-lg font-mono text-gray-800 break-all">
          {smiles}
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Predicted Properties
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertyKeys.map((key) => (
          <PropertyCard
            key={key}
            propertyKey={key}
            value={properties[key]}
          />
        ))}
      </div>
    </div>
  );
}
