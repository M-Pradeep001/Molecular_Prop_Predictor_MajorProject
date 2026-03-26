import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Info, RotateCcw, ZoomIn, ZoomOut, Atom, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.jsx';
import { analyzeMolecularBehavior } from '../utils/molecularAnalysis';
import api from '../services/api';

let $3Dmol = null;

export function PredictionPanel({ smiles, result, isLoading, error, onRetry }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const { isDark } = useTheme();
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
        } catch {
          setViewerError('Failed to load 3D viewer library');
        }
      }
    };
    load3Dmol();
  }, []);

  useEffect(() => {
    if (!smiles) { setMoleculeData(null); return; }
    const fetchMoleculeData = async () => {
      setViewerLoading(true);
      setViewerError(null);
      try {
        const response = await api.post('/molecule/3d', { smiles });
        setMoleculeData(response.data);
      } catch {
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
        const bgColor = isDark ? '#111113' : '#ffffff';
        viewerRef.current = $3Dmol.createViewer(container, { backgroundColor: bgColor });
        if (!moleculeData.atoms || moleculeData.atoms.length === 0) throw new Error('No atoms');
        let pdbData = 'REMARK   1 Molecule\n';
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
    return () => { clearTimeout(timer); if (viewerRef.current) viewerRef.current.clear(); };
  }, [moleculeData, viewerStyle, isDark]);

  return (
    <section id="predict" className="py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-heading">Molecular Analysis</h2>
          <p className="section-subheading">Real-time 3D visualization and quantum property prediction</p>
        </motion.div>

<<<<<<< HEAD
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Current Molecule</h3>
                <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">SMILES</span>
=======
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="space-y-4">
            {/* SMILES display */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">Current Molecule</span>
                <span className="badge bg-brand-50 dark:bg-brand-600/10 border border-brand-200 dark:border-brand-600/30 text-brand-700 dark:text-brand-400">SMILES</span>
>>>>>>> fba12e7 (Updated UI: Modified the coloring and layout, enhanced the dark theme appealing)
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 break-all min-h-[2.5rem]">
                {smiles || <span className="text-zinc-400 dark:text-zinc-600">No molecule selected</span>}
              </div>
            </div>

            {/* Prediction status */}
            <div className="card p-5">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white block mb-4">Status</span>
              {isLoading ? (
                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Running EGNN model…</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Processing molecular graph</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Prediction failed</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{error}</p>
                    <button
                      onClick={onRetry}
                      className="mt-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Try again →
                    </button>
                  </div>
                </div>
              ) : result ? (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Prediction complete</p>
                    <p className="text-xs text-zinc-500 mt-0.5">5 properties calculated</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">Enter a SMILES string to begin analysis</p>
              )}
            </div>

            {/* Molecular summary */}
            {result && <MolecularSummary properties={result.properties} />}
          </div>

          {/* 3D Viewer */}
          <motion.div
            layout
            className={`card overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
          >
            {/* Viewer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-brand-500" />
                3D Viewer
              </span>
              <div className="flex items-center gap-1">
                <select
                  value={viewerStyle}
                  onChange={(e) => setViewerStyle(e.target.value)}
                  className="px-2 py-1 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="stick">Stick</option>
                  <option value="sphere">Sphere</option>
                  <option value="line">Line</option>
                </select>
                {[
                  { action: () => viewerRef.current?.zoom(1.2), icon: <ZoomIn className="w-3.5 h-3.5" /> },
                  { action: () => viewerRef.current?.zoom(0.8), icon: <ZoomOut className="w-3.5 h-3.5" /> },
                  { action: () => { viewerRef.current?.rotate(90); viewerRef.current?.render(); }, icon: <RotateCcw className="w-3.5 h-3.5" /> },
                  { action: () => setIsFullscreen(!isFullscreen), icon: isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" /> },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Viewer canvas */}
            <div
              ref={containerRef}
              className={`relative flex-1 ${isDark ? 'bg-[#111113]' : 'bg-white'}`}
              style={{ minHeight: isFullscreen ? 'calc(100vh - 160px)' : '420px' }}
            >
              {!smiles && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Atom className={`w-10 h-10 mb-3 opacity-40 ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>No molecule to display</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Enter a SMILES string above</p>
                </div>
              )}
              {viewerLoading && smiles && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin mb-2" />
                  <p className="text-xs text-slate-400">Loading 3D structure…</p>
                </div>
              )}
              {viewerError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Info className="w-8 h-8 mb-2 text-red-400 opacity-50" />
                  <p className="text-xs text-red-400">{viewerError}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MolecularSummary({ properties }) {
  const { summary, behaviors, tags, applications } = analyzeMolecularBehavior(properties);

  return (
<<<<<<< HEAD
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 dark:bg-white/5 dark:border-white/10">
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-2 rounded-lg ${stability.bg} text-center`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Stability</p>
          <p className={`text-sm font-bold ${stability.color}`}>{stability.level}</p>
        </div>
        <div className={`p-2 rounded-lg ${reactivity.bg} text-center`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Reactivity</p>
          <p className={`text-sm font-bold ${reactivity.color}`}>{reactivity.level}</p>
        </div>
        <div className={`p-2 rounded-lg ${polarity.bg} text-center`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Polarity</p>
          <p className={`text-sm font-bold ${polarity.color}`}>{polarity.level}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Uses:</span>
        <div className="flex flex-wrap gap-1">
          {applications.slice(0, 2).map((app, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">{app}</span>
          ))}
        </div>
      </div>
=======
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Molecular Behavior Profile</span>
        <div className="flex gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
        <p className="relative text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium italic">
          "{summary}"
        </p>
      </div>

      {/* Behavioral Insights */}
      <div className="grid gap-3">
        <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">Scientific Insights</h4>
        <div className="space-y-2">
          {behaviors.map((b, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-1 h-1 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Applications */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight mb-3">Predicted Applications</h4>
        <div className="flex flex-wrap gap-2">
          {applications.map((app) => (
            <span
              key={app}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-600/10 border border-brand-200 dark:border-brand-600/30 text-brand-700 dark:text-brand-400"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
>>>>>>> fba12e7 (Updated UI: Modified the coloring and layout, enhanced the dark theme appealing)
    </motion.div>
  );
}
