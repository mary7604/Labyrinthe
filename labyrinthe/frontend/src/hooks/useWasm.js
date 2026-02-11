import { useState, useEffect } from 'react';

export function useWasm() {
    const [wasmModule, setWasmModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //charge et initialise le module WebAssembly et expose les fonctions C++ au frontend
    useEffect(() => {
        async function loadWasm() {
            try {
                console.log(' Chargement du module WASM...');
                
                // Import du module WASM
                const createModule = (await import('../wasm/pathfinding.js')).default;
                console.log('Module importé');
                
                // Initialisation
                const module = await createModule();
                console.log('Module WASM initialisé');
                
                // Debug: afficher les fonctions disponibles
                console.log(' Fonctions disponibles:', Object.keys(module));
                
                setWasmModule(module);
                setLoading(false);
                
                console.log('WASM prêt à être utilisé!');
            } catch (err) {
                console.error(' Erreur de chargement WASM:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        loadWasm();
    }, []);

    return { wasmModule, loading, error };
}