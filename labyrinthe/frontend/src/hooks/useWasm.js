import { useState, useEffect } from 'react';

export function useWasm() {
  const [wasmModule, setWasmModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWasm() {
      try {
        console.log('🚀 Chargement module WASM...');
        
        // Importer depuis src/wasm/ au lieu de /public/wasm/
        const createModule = (await import('../wasm/pathfinding.js')).default;
        const module = await createModule();
        
        setWasmModule(module);
        setLoading(false);
        
        console.log('✅ Module WASM chargé !');
      } catch (err) {
        console.error('❌ Erreur chargement WASM:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadWasm();
  }, []);

  return { wasmModule, loading, error };
}