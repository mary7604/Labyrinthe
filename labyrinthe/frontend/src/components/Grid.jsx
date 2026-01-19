import React from 'react';

export function Grid({ grid, path, start, end }) {
  const cellSize = 20;
  
  return (
    <div style={{ 
      display: 'inline-block', 
      background: '#1a1a2e', 
      padding: '20px', 
      borderRadius: '10px' 
    }}>
      <svg 
        width={grid[0].length * cellSize} 
        height={grid.length * cellSize}
        style={{ 
          border: '2px solid #667eea', 
          borderRadius: '8px',
          background: 'white'
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            let fill = '#f3f4f6';
            
            if (cell === 1) {
              fill = '#1f2937';
            } else if (start.x === x && start.y === y) {
              fill = '#4ade80';
            } else if (end.x === x && end.y === y) {
              fill = '#ef4444';
            } else if (path.some(p => p.x === x && p.y === y)) {
              fill = '#fbbf24';
            }
            
            return (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fill}
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}