import axios from 'axios';

const API_BASE_URL = '';  // Use Vite proxy (configured in vite.config.js)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export async function predictProperties(smiles) {
  console.log('[API] predictProperties called with:', smiles);
  try {
    console.log('[API] Making POST request to /predict/all');
    const response = await api.post('/predict/all', { smiles });
    console.log('[API] Response received:', response);
    const data = response.data;
    console.log('[API] Response data:', data);
    
    // Transform backend response to frontend format
    const propertyMap = {
      'homo': 'homo',
      'lumo': 'lumo',
      'gap': 'gap',
      'dipole': 'dipole',
      'polar': 'polar',
    };
    
    // Map display names to keys - keys must match the output of: name.toLowerCase().replace(/[-\s]/g, '')
    const displayNameMap = {
      'homo': 'homo',
      'lumo': 'lumo',
      'homolumogap': 'gap',      // HOMO-LUMO Gap -> homolumogap
      'gap': 'gap',
      'dipolemoment': 'dipole',  // Dipole Moment -> dipolemoment
      'dipole': 'dipole',
      'polarization': 'polar',   // Polarization -> polarization
      'polar': 'polar',
      'polarizability': 'polar',
    };
    
    // Handle different response formats
    let predictions = {};
    if (data.predictions && Array.isArray(data.predictions)) {
      // Array format from backend
      data.predictions.forEach((pred) => {
        const key = displayNameMap[pred.property?.toLowerCase().replace(/[-\s]/g, '')];
        if (key && pred.value !== undefined) {
          predictions[key] = pred.value;
        }
      });
    } else if (data.predictions && typeof data.predictions === 'object') {
      // Object format - direct mapping
      Object.entries(data.predictions).forEach(([key, value]) => {
        const mappedKey = displayNameMap[key.toLowerCase().replace(/[-\s]/g, '')] || key;
        predictions[mappedKey] = value;
      });
    }
    
    // Log for debugging
    console.log('Backend response:', data);
    console.log('Parsed predictions:', predictions);
    
    return {
      smiles: data.smiles,
      properties: predictions,
    };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Cannot connect to backend server. Please ensure it is running.');
    } else {
      throw new Error(error.message || 'Failed to predict properties');
    }
  }
}

export async function checkHealth() {
  try {
    const response = await api.get('/');
    return { ...response.data, status: 'healthy' };
  } catch (error) {
    throw new Error('Backend unavailable');
  }
}

export async function predictBatch(smilesList) {
  try {
    const response = await api.post('/predict/batch/all', { smiles_list: smilesList });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Batch prediction failed');
  }
}

export default api;
