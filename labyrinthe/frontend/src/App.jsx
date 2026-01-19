import { useState, useRef, useEffect } from 'react';
import { useWasm } from './hooks/useWasm';
import { AStar } from './algorithms/AStar';
import './App.css';

function App() {
  const { wasmModule, loading, error } = useWasm();
  
  const [grid, setGrid] = useState(() => {
    const rows = 25;
    const cols = 45;
    return Array(rows).fill().map(() => Array(cols).fill(0));
  });
  
  const [start, setStart] = useState({ x: 12, y: 12 });
  const [end, setEnd] = useState({ x: 25, y: 12 });
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [pathCells, setPathCells] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  
  const [stats, setStats] = useState({
    visited: 0,
    pathLength: 0,
    execTime: 0
  });
  
  const [statusText, setStatusText] = useState('Prêt - Dessinez des obstacles');
  
  const generateMaze = () => {
    const newGrid = Array(grid.length).fill().map(() => Array(grid[0].length).fill(0));
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[0].length; x++) {
        if ((x !== start.x || y !== start.y) && (x !== end.x || y !== end.y)) {
          if (Math.random() < 0.3) {
            newGrid[y][x] = 1;
          }
        }
      }
    }
    setGrid(newGrid);
    setVisitedCells(new Set());
    setPathCells([]);
    setStats({ visited: 0, pathLength: 0, execTime: 0 });
    setStatusText('Labyrinthe généré');
  };
  
  const clearGrid = () => {
    setGrid(Array(grid.length).fill().map(() => Array(grid[0].length).fill(0)));
    setVisitedCells(new Set());
    setPathCells([]);
    setStats({ visited: 0, pathLength: 0, execTime: 0 });
    setStatusText('Grille effacée');
  };
  
  const runAStar = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setVisitedCells(new Set());
    setPathCells([]);
    setStatusText('Recherche A* en cours...');
    
    const startTime = performance.now();
    const astar = new AStar(grid);
    
    const tempVisited = new Set();
    const callback = async (current) => {
      tempVisited.add(`${current.x},${current.y}`);
      setVisitedCells(new Set(tempVisited));
      setStats(prev => ({ ...prev, visited: tempVisited.size }));
      
      await new Promise(resolve => setTimeout(resolve, 101 - animationSpeed));
    };
    
    const result = await astar.findPathWithAnimation(start.x, start.y, end.x, end.y, callback);
    const endTime = performance.now();
    
    setPathCells(result.path);
    setStats({
      visited: result.exploredCells,
      pathLength: result.path.length,
      execTime: Math.round(endTime - startTime)
    });
    setStatusText(result.path.length > 0 ? 'Chemin trouvé (A*)!' : 'Aucun chemin');
    setIsAnimating(false);
  };
  
  const runDijkstra = async () => {
    if (!wasmModule) {
      alert('⏳ Module WASM en cours de chargement...');
      return;
    }
    
    console.log('🔍 Module WASM:', wasmModule);
    console.log('🔍 Fonctions:', Object.keys(wasmModule));
    
    if (isAnimating) return;
    setIsAnimating(true);
    setVisitedCells(new Set());
    setPathCells([]);
    setStatusText('Recherche Dijkstra en cours...');
    
    try {
      const result = wasmModule.findPathDijkstra(grid, start.x, start.y, end.x, end.y);
      
      console.log('✅ Résultat:', result);
      
      setPathCells(result.path);
      setStats({
        visited: result.exploredCells,
        pathLength: result.path.length,
        execTime: result.timeMs.toFixed(0)
      });
      setStatusText(result.path.length > 0 ? 'Chemin trouvé (Dijkstra)!' : 'Aucun chemin');
    } catch (err) {
      console.error('❌ Erreur Dijkstra:', err);
      alert('Erreur: ' + err.message);
      setStatusText('Erreur lors de l\'exécution');
    }
    
    setIsAnimating(false);
  };
  
  if (loading) {
    return <div className="loading">🚀 Chargement du module WASM...</div>;
  }
  
  if (error) {
    return <div className="error">❌ Erreur : {error}</div>;
  }
  
  return (
    <div className="app-container">
      <Sidebar 
        onRunAStar={runAStar}
        onRunDijkstra={runDijkstra}
        onGenerate={generateMaze}
        onClear={clearGrid}
        stats={stats}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        isAnimating={isAnimating}
      />
      
      <MainContent 
        grid={grid}
        setGrid={setGrid}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        visitedCells={visitedCells}
        pathCells={pathCells}
        dragTarget={dragTarget}
        setDragTarget={setDragTarget}
        isAnimating={isAnimating}
        statusText={statusText}
      />
    </div>
  );
}

function Sidebar({ onRunAStar, onRunDijkstra, onGenerate, onClear, stats, animationSpeed, setAnimationSpeed, isAnimating }) {
  return (
    <div className="sidebar">
      <div className="section">
        <h3>🎯 Algorithme</h3>
        <select>
          <option value="astar">A* (A-Star)</option>
          <option value="dijkstra">Dijkstra</option>
        </select>
      </div>

      <div className="section">
        <h3>⚙️ Vitesse</h3>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
        />
      </div>

      <div className="section">
        <h3>🎨 Légende</h3>
        <div className="legend-item">
          <div className="color-box" style={{background: '#4ade80'}}></div>
          <span>Départ</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{background: '#ef4444'}}></div>
          <span>Arrivée</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{background: '#1f2937'}}></div>
          <span>Mur</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{background: '#60a5fa'}}></div>
          <span>Visité</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{background: '#fbbf24'}}></div>
          <span>Chemin</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onRunAStar} disabled={isAnimating}>
        ▶ A* (JavaScript)
      </button>
      <button className="btn btn-primary" onClick={onRunDijkstra} disabled={isAnimating}>
        ⚡ Dijkstra (WASM)
      </button>
      <button className="btn btn-success" onClick={onGenerate} disabled={isAnimating}>
        🎲 Générer
      </button>
      <button className="btn btn-danger" onClick={onClear} disabled={isAnimating}>
        🗑️ Effacer
      </button>

      <div className="stats">
        <p>Visités: <span>{stats.visited}</span></p>
        <p>Chemin: <span>{stats.pathLength}</span></p>
        <p>Temps: <span>{stats.execTime}ms</span></p>
      </div>
    </div>
  );
}

function MainContent({ grid, setGrid, start, setStart, end, setEnd, visitedCells, pathCells, dragTarget, setDragTarget, isAnimating, statusText }) {
  const canvasRef = useRef(null);
  const cellSize = 25;
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    drawGrid();
  }, [grid, start, end, visitedCells, pathCells]);
  
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const px = x * cellSize;
        const py = y * cellSize;
        
        if (x === start.x && y === start.y) {
          ctx.fillStyle = '#4ade80';
        } else if (x === end.x && y === end.y) {
          ctx.fillStyle = '#ef4444';
        } else if (grid[y][x] === 1) {
          ctx.fillStyle = '#1f2937';
        } else if (pathCells.some(p => p.x === x && p.y === y)) {
          ctx.fillStyle = '#fbbf24';
        } else if (visitedCells.has(`${x},${y}`)) {
          ctx.fillStyle = '#60a5fa';
        } else {
          ctx.fillStyle = '#f3f4f6';
        }
        
        ctx.fillRect(px, py, cellSize, cellSize);
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, cellSize, cellSize);
      }
    }
  };
  
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    
    if (x === start.x && y === start.y) {
      setDragTarget('start');
    } else if (x === end.x && y === end.y) {
      setDragTarget('end');
    } else {
      setIsDrawing(true);
      const newGrid = [...grid];
      newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;
      setGrid(newGrid);
    }
  };
  
  const handleMouseMove = (e) => {
    if (isAnimating) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      if (dragTarget === 'start') {
        setStart({x, y});
      } else if (dragTarget === 'end') {
        setEnd({x, y});
      } else if (isDrawing) {
        if ((x !== start.x || y !== start.y) && (x !== end.x || y !== end.y)) {
          const newGrid = [...grid];
          newGrid[y][x] = 1;
          setGrid(newGrid);
        }
      }
    }
  };
  
  const handleMouseUp = () => {
    setDragTarget(null);
    setIsDrawing(false);
  };
  
  return (
    <div className="main-content">
      <canvas 
        ref={canvasRef}
        width={grid[0].length * cellSize}
        height={grid.length * cellSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="status-bar">
        <span>{statusText}</span>
      </div>
    </div>
  );
}

export default App;