import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PredictionPanel } from './components/PredictionPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ModelExplainer } from './components/ModelExplainer';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { DatasetSection } from './components/DatasetSection';
import { EngineeringInsights } from './components/EngineeringInsights';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { predictProperties, checkHealth } from './services/api';
import { AlertCircle, X, FlaskConical } from 'lucide-react';

function ErrorToast({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900 shadow-card-md rounded-xl max-w-sm"
    >
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      <p className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [currentSmiles, setCurrentSmiles] = useState('');

  useEffect(() => {
    checkHealth()
      .then((s) => setBackendStatus({ ...s, available: true }))
      .catch((e) => setBackendStatus({ available: false, error: e.message }));
  }, []);

  const handlePredict = async (smiles) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentSmiles(smiles);
    try {
      const data = await predictProperties(smiles);
      setResult(data);
      setTimeout(() => {
        document.getElementById('predict')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    } catch (err) {
      setError(err.message || 'Failed to predict properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => { if (currentSmiles) handlePredict(currentSmiles); };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] transition-colors duration-200">
        <Navbar />

        <main>
          <HeroSection onPredict={handlePredict} isLoading={loading} />
          <PredictionPanel smiles={currentSmiles} result={result} isLoading={loading} error={error} onRetry={handleRetry} />
          <ResultsDashboard result={result} />
          <ModelExplainer />
          <PerformanceDashboard />
          <DatasetSection />
          <EngineeringInsights />
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <FlaskConical className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">Molecular Property Transformers</span>
              </div>

              <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px] mt-1 leading-relaxed">
                A Framework for Chemically-Informed Model Training
              </p>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  backendStatus?.available
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${backendStatus?.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  Backend {backendStatus?.available ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-zinc-400">
              Data from the QM9 dataset. Predictions are for research purposes only — not for safety-critical applications.
            </p>
          </div>
        </footer>

        {/* Error toast */}
        <AnimatePresence>
          {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;
