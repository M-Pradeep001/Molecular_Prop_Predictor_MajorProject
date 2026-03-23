import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Info, RotateCcw, ZoomIn, ZoomOut, Atom } from 'lucide-react';
import api from '../services/api';

let $3Dmol = null;

export function PredictionPanel({ smiles, result, isLoading, error, onRetry }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerStyle, setViewerStyle] = useState('stick');
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState(null);
  const [moleculeData, setMoleculeData] = useState(null);

  useEffect(() => {
    const load3Dmol = async () => {
      if (typeof window !== 'undefined' && !$3Dmol) {
        try {
          const module = await import('3dmol');
          $3Dmol = module.default || module;
        } catch (err) {
          setViewerError('Failed to load 3D viewer library');
        }
      }
    };
    load3Dmol();
  }, []);

  useEffect(() => {
    if (!smiles) {
      setMoleculeData(null);
      return;
    }

    const fetchMoleculeData = async () => {
      setViewerLoading(true);
      setViewerError(null);
      
      try {
        const response = await api.post('/molecule/3d', { smiles });
        setMoleculeData(response.data);
      } catch (err) {
        setViewerError('Failed to load 3D structure');
      } finally {
        setViewerLoading(false);
      }
    };

    fetchMoleculeData();
  }, [smiles]);

  useEffect(() => {
    if (!moleculeData || !containerRef.current || !$3Dmol) return;

    const timer = setTimeout(() => {
      try {
        const container = containerRef.current;
        container.innerHTML = '';

        viewerRef.current = $3Dmol.createViewer(container, { 
          backgroundColor: '#1e293b'
        });

        if (!moleculeData.atoms || moleculeData.atoms.length === 0) {
          throw new Error('No atoms in molecule data');
        }

        let pdbData = 'REMARK   1 Molecule from SMILES\nCOMPND    MOL_ID: 1;\n';
        
        moleculeData.atoms.forEach((atom, i) => {
          pdbData += `ATOM  ${(i+1).toString().padStart(5)} ${atom.elem.padEnd(4)} MOL A   1    ${atom.x.toFixed(3).padStart(8)}${atom.y.toFixed(3).padStart(8)}${atom.z.toFixed(3).padStart(8)}  1.00  0.00          ${atom.elem.padEnd(2)}\n`;
        });
        
        if (moleculeData.bonds) {
          moleculeData.bonds.forEach(([i, j]) => {
            pdbData += `CONECT${(i+1).toString().padStart(5)}${(j+1).toString().padStart(5)}\n`;
          });
        }
        
        pdbData += 'END\n';

        viewerRef.current.addModel(pdbData, 'pdb');
        viewerRef.current.setStyle({}, { [viewerStyle]: { colorscheme: 'Jmol' } });
        viewerRef.current.zoomTo();
        viewerRef.current.render();
      } catch (err) {
        setViewerError('Failed to render 3D: ' + err.message);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [moleculeData, viewerStyle]);

  return (
    <section id="predict" className="py-20 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Molecular Analysis</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">Real-time 3D visualization and quantum property prediction</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Current Molecule</h3>
                <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">SMILES</span>
              </div>
              <div className="bg-navy-900/50 rounded-xl p-4 font-mono text-sm text-gray-300 break-all">
                {smiles || 'No molecule selected'}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 dark:bg-white/5 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prediction Status</h3>
              
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Running EGNN Model...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Processing molecular graph</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                  <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Prediction Failed</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={onRetry} className="mt-3 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors">Try Again</button>
                  </div>
                </div>
              ) : result ? (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Prediction Complete</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">5 properties calculated</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Enter a SMILES string to begin analysis</p>
              )}
            </div>

            {result && <MolecularSummary properties={result.properties} />}
          </div>

          <motion.div layout className={`glass-dark rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[500px]'}`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Atom className="w-5 h-5" /> 3D Molecular Viewer
              </h3>
              <div className="flex items-center gap-2">
                <select value={viewerStyle} onChange={(e) => setViewerStyle(e.target.value)} className="px-3 py-1.5 bg-navy-900 border border-white/20 rounded-lg text-sm text-white outline-none focus:border-blue-400">
                  <option value="stick" className="bg-navy-800">Stick</option>
                  <option value="sphere" className="bg-navy-800">Sphere</option>
                  <option value="line" className="bg-navy-800">Line</option>
                </select>
                <button onClick={() => viewerRef.current?.zoom(0.8)} className="p-2 rounded-lg hover:bg-white/10"><ZoomIn className="w-4 h-4 text-white" /></button>
                <button onClick={() => viewerRef.current?.zoom(1.2)} className="p-2 rounded-lg hover:bg-white/10"><ZoomOut className="w-4 h-4 text-white" /></button>
                <button onClick={() => { viewerRef.current?.rotate(90); viewerRef.current?.render(); }} className="p-2 rounded-lg hover:bg-white/10"><RotateCcw className="w-4 h-4 text-white" /></button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg hover:bg-white/10">
                  {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>

            <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-navy-900 to-navy-800" style={{ minHeight: isFullscreen ? 'calc(100vh - 200px)' : '400px' }}>
              {!smiles && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Atom className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No molecule to display</p>
                  <p className="text-sm opacity-70">Enter a SMILES string above</p>
                </div>
              )}
              {viewerLoading && smiles && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4" />
                  <p className="text-sm">Loading 3D structure...</p>
                </div>
              )}
              {viewerError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                  <Info className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">{viewerError}</p>
                </div>
              )}
            </div>

            {isFullscreen && <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl"><Minimize2 className="w-6 h-6 text-white" /></button>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MolecularSummary({ properties }) {
  const { homo, lumo, gap, dipole, polar } = properties || {};

  // Classify based on HOMO-LUMO gap
  const getStability = () => {
    if (gap > 6) return { level: 'High', reason: 'Large energy gap makes electron transfer difficult', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (gap > 3) return { level: 'Medium', reason: 'Moderate gap allows some reactivity', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { level: 'Low', reason: 'Small gap enables easy electron excitation', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const getReactivity = () => {
    if (gap < 3) return { level: 'High', reason: 'Electrons easily excited for reactions', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (gap < 6) return { level: 'Medium', reason: 'Balanced reactivity profile', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { level: 'Low', reason: 'Stable, resists chemical changes', color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  const getPolarity = () => {
    const d = dipole || 0;
    if (d < 1) return { level: 'Non-polar', reason: 'Minimal charge separation across molecule', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (d < 3) return { level: 'Weakly polar', reason: 'Slight uneven charge distribution', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    return { level: 'Polar', reason: 'Significant positive/negative charge separation', color: 'text-orange-400', bg: 'bg-orange-500/10' };
  };

  const stability = getStability();
  const reactivity = getReactivity();
  const polarity = getPolarity();

  const applications = [];
  if (gap > 5) applications.push('Insulators / Dielectrics');
  if (gap < 3) applications.push('Conductive materials');
  if (dipole > 2) applications.push('Solvents / Drug delivery');
  if (dipole < 1 && gap > 6) applications.push('Organic electronics');
  if (applications.length === 0) applications.push('General chemical synthesis');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 dark:bg-white/5 dark:border-white/10">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Molecular Profile</h3>
      
      <div className="space-y-2">
        <div className={`p-2 rounded-lg ${stability.bg} flex items-center gap-2`}>
          <div className={`text-sm font-medium ${stability.color} min-w-[80px]`}>Stability: {stability.level}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">{stability.reason}</p>
        </div>

        <div className={`p-2 rounded-lg ${reactivity.bg} flex items-center gap-2`}>
          <div className={`text-sm font-medium ${reactivity.color} min-w-[80px]`}>Reactivity: {reactivity.level}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">{reactivity.reason}</p>
        </div>

        <div className={`p-2 rounded-lg ${polarity.bg} flex items-center gap-2`}>
          <div className={`text-sm font-medium ${polarity.color} min-w-[80px]`}>Polarity: {polarity.level}</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">{polarity.reason}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applications:</p>
        <div className="flex flex-wrap gap-1">
          {applications.slice(0, 3).map((app, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">{app}</span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        {stability.level} stability, {reactivity.level.toLowerCase()} reactivity, {polarity.level.toLowerCase()}. Best for {applications[0].toLowerCase()}.
      </p>
    </motion.div>
  );
}
