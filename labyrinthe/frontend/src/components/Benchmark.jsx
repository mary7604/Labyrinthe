import React from 'react';

export function Benchmark({ results }) {
  if (!results.dijkstra && !results.astar) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📊 Résultats Benchmark</h2>
        <p style={styles.noData}>Aucun résultat pour le moment</p>
      </div>
    );
  }
  
  const speedup = results.dijkstra && results.astar 
    ? (results.astar.timeMs / results.dijkstra.timeMs).toFixed(2)
    : '-';
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Résultats Benchmark</h2>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚡ Dijkstra (C++ WASM)</h3>
          {results.dijkstra ? (
            <>
              <div style={styles.stat}>
                <span style={styles.label}>Temps:</span>
                <span style={styles.value}>{results.dijkstra.timeMs.toFixed(2)} ms</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.label}>Cases explorées:</span>
                <span style={styles.value}>{results.dijkstra.exploredCells}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.label}>Longueur chemin:</span>
                <span style={styles.value}>{results.dijkstra.path.length}</span>
              </div>
            </>
          ) : (
            <p style={styles.noData}>Pas encore exécuté</p>
          )}
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🧠 A* (JavaScript)</h3>
          {results.astar ? (
            <>
              <div style={styles.stat}>
                <span style={styles.label}>Temps:</span>
                <span style={styles.value}>{results.astar.timeMs.toFixed(2)} ms</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.label}>Cases explorées:</span>
                <span style={styles.value}>{results.astar.exploredCells}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.label}>Longueur chemin:</span>
                <span style={styles.value}>{results.astar.path.length}</span>
              </div>
            </>
          ) : (
            <p style={styles.noData}>Pas encore exécuté</p>
          )}
        </div>
      </div>
      
      {results.dijkstra && results.astar && (
        <div style={styles.winner}>
          <h3>🏆 Gagnant</h3>
          <p style={styles.winnerText}>
            {results.dijkstra.timeMs < results.astar.timeMs ? '⚡ Dijkstra (WASM)' : '🧠 A* (JavaScript)'}
          </p>
          <p style={styles.speedupText}>
            Gain de performance: <strong>{speedup}x</strong>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: '#2d2d44',
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
    marginTop: '20px'
  },
  title: {
    color: '#4a9eff',
    marginBottom: '20px',
    fontSize: '1.5em',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  card: {
    background: '#1e1e2f',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #444'
  },
  cardTitle: {
    color: '#4a9eff',
    marginBottom: '15px',
    fontSize: '1.2em',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px'
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '8px 0'
  },
  label: {
    color: '#aaa',
    fontSize: '0.95em'
  },
  value: {
    color: '#4a9eff',
    fontWeight: 'bold',
    fontSize: '1.1em'
  },
  noData: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px'
  },
  winner: {
    background: 'linear-gradient(135deg, #1e1e2f, #2d2d44)',
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #667eea'
  },
  winnerText: {
    fontSize: '1.8em',
    color: '#4ade80',
    fontWeight: 'bold',
    margin: '15px 0',
    textShadow: '0 2px 10px rgba(74, 222, 128, 0.3)'
  },
  speedupText: {
    color: '#fbbf24',
    fontSize: '1.3em',
    marginTop: '10px'
  }
};