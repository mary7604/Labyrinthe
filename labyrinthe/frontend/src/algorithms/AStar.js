export class AStar {
  constructor(grid) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
  }

  // Méthode SANS animation (version originale)
  findPath(startX, startY, endX, endY) {
    const startTime = performance.now();
    
    const openSet = [{x: startX, y: startY}];
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parents = new Map();
    
    const key = (x, y) => `${x},${y}`;
    const h = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
    
    gScore.set(key(startX, startY), 0);
    fScore.set(key(startX, startY), h(startX, startY, endX, endY));
    
    let exploredCells = 0;
    
    while (openSet.length > 0) {
      let minIdx = 0;
      let minF = fScore.get(key(openSet[0].x, openSet[0].y));
      
      for (let i = 1; i < openSet.length; i++) {
        const f = fScore.get(key(openSet[i].x, openSet[i].y));
        if (f < minF) {
          minIdx = i;
          minF = f;
        }
      }
      
      const current = openSet[minIdx];
      openSet[minIdx] = openSet[openSet.length - 1];
      openSet.pop();
      
      exploredCells++;
      
      if (current.x === endX && current.y === endY) {
        const path = [{x: current.x, y: current.y}];
        let curr = current;
        
        while (parents.has(key(curr.x, curr.y))) {
          curr = parents.get(key(curr.x, curr.y));
          path.unshift({x: curr.x, y: curr.y});
        }
        
        const endTime = performance.now();
        
        return {
          path,
          exploredCells,
          timeMs: endTime - startTime
        };
      }
      
      closedSet.add(key(current.x, current.y));
      
      const directions = [{x:0,y:-1}, {x:0,y:1}, {x:-1,y:0}, {x:1,y:0}];
      
      for (const dir of directions) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;
        
        if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows ||
            this.grid[ny][nx] === 1) continue;
        
        const nKey = key(nx, ny);
        if (closedSet.has(nKey)) continue;
        
        const tentativeG = gScore.get(key(current.x, current.y)) + 1;
        
        if (!openSet.find(n => n.x === nx && n.y === ny)) {
          openSet.push({x: nx, y: ny});
        } else if (tentativeG >= (gScore.get(nKey) || Infinity)) {
          continue;
        }
        
        parents.set(nKey, {x: current.x, y: current.y});
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + h(nx, ny, endX, endY));
      }
    }
    
    const endTime = performance.now();
    
    return {
      path: [],
      exploredCells,
      timeMs: endTime - startTime
    };
  }

  // Méthode AVEC animation (nouvelle)
  async findPathWithAnimation(startX, startY, endX, endY, callback) {
    const openSet = [{x: startX, y: startY}];
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parents = new Map();
    
    const key = (x, y) => `${x},${y}`;
    const h = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
    
    gScore.set(key(startX, startY), 0);
    fScore.set(key(startX, startY), h(startX, startY, endX, endY));
    
    let exploredCells = 0;
    
    while (openSet.length > 0) {
      let minIdx = 0;
      let minF = fScore.get(key(openSet[0].x, openSet[0].y));
      
      for (let i = 1; i < openSet.length; i++) {
        const f = fScore.get(key(openSet[i].x, openSet[i].y));
        if (f < minF) {
          minIdx = i;
          minF = f;
        }
      }
      
      const current = openSet[minIdx];
      openSet[minIdx] = openSet[openSet.length - 1];
      openSet.pop();
      
      exploredCells++;
      
      // Animation callback
      if (callback && !(current.x === startX && current.y === startY)) {
        await callback(current);
      }
      
      if (current.x === endX && current.y === endY) {
        const path = [{x: current.x, y: current.y}];
        let curr = current;
        
        while (parents.has(key(curr.x, curr.y))) {
          curr = parents.get(key(curr.x, curr.y));
          path.unshift({x: curr.x, y: curr.y});
        }
        
        return { path, exploredCells };
      }
      
      closedSet.add(key(current.x, current.y));
      
      const directions = [{x:0,y:-1}, {x:0,y:1}, {x:-1,y:0}, {x:1,y:0}];
      
      for (const dir of directions) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;
        
        if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows ||
            this.grid[ny][nx] === 1) continue;
        
        const nKey = key(nx, ny);
        if (closedSet.has(nKey)) continue;
        
        const tentativeG = gScore.get(key(current.x, current.y)) + 1;
        
        if (!openSet.find(n => n.x === nx && n.y === ny)) {
          openSet.push({x: nx, y: ny});
        } else if (tentativeG >= (gScore.get(nKey) || Infinity)) {
          continue;
        }
        
        parents.set(nKey, {x: current.x, y: current.y});
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + h(nx, ny, endX, endY));
      }
    }
    
    return { path: [], exploredCells };
  }
}