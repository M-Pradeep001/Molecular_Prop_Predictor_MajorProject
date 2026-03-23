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
import { predictProperties, checkHealth } from './services/api';
import { AlertCircle, X } from 'lucide-react';

function ErrorToast({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-dark rounded-xl p-4 flex items-center gap-3 border border-red-500/30 shadow-xl"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <p className="text-sm text-white">{message}</p>
      <button 
        onClick={onDismiss}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
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

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const status = await checkHealth();
        setBackendStatus({ ...status, available: true });
      } catch (err) {
        setBackendStatus({ available: false, error: err.message });
      }
    };
    checkBackend();
  }, []);

  const handlePredict = async (smiles) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentSmiles(smiles);

    try {
      const data = await predictProperties(smiles);
      setResult(data);
      
      // Scroll to results after a short delay
      setTimeout(() => {
        const resultsSection = document.getElementById('predict');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to predict properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissError = () => setError(null);

  const handleRetry = () => {
    if (currentSmiles) {
      handlePredict(currentSmiles);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 transition-colors duration-300">
      <Navbar />
      
      <main>
        <HeroSection 
          onPredict={handlePredict} 
          isLoading={loading} 
        />
        
        <PredictionPanel 
          smiles={currentSmiles}
          result={result}
          isLoading={loading}
          error={error}
          onRetry={handleRetry}
        />
        
        <ResultsDashboard result={result} />
        
        <ModelExplainer />
        
        <PerformanceDashboard />
        
        <DatasetSection />
        
        <EngineeringInsights />
      </main>

      {/* Footer */}
      <footer className="py-12 bg-navy-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-lg font-bold gradient-text">MolPredict</span>
            </div>
            
            <p className="text-sm text-gray-500">
              Built with React, FastAPI, PyTorch Geometric & 3Dmol.js
            </p>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                backendStatus?.available
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  backendStatus?.available ? 'bg-green-400' : 'bg-red-400'
                }`} />
                Backend {backendStatus?.available ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs text-gray-600">
            <p>
              Data from the QM9 dataset. Predictions are for research purposes only.
              Not for use in safety-critical applications.
            </p>
          </div>
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <ErrorToast 
            message={error} 
            onDismiss={handleDismissError} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
