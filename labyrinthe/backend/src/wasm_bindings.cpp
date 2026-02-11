#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "AStar.h"
#include "Dijkstra.h"
#include "Graphe.h"
#include <vector>

using namespace emscripten;

// ========== FONCTIONS UTILITAIRES ==========

int coordsToId(int x, int y, int largeur) {
    return y * largeur + x;
}

struct Coords {
    int x, y;
};

Coords idToCoords(int id, int largeur) {
    return {id % largeur, id / largeur};
}

// ========== CONVERSION GRILLE → GRAPHE ==========

Graphe convertirGrilleEnGraphe(val gridJS) {
    int rows = gridJS["length"].as<int>();
    int cols = gridJS[0]["length"].as<int>();
    
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols));
    for (int y = 0; y < rows; y++) {
        for (int x = 0; x < cols; x++) {
            grid[y][x] = gridJS[y][x].as<int>();
        }
    }
    
    Graphe graphe(rows * cols);
    
    const int dx[] = {0, 0, -1, 1};
    const int dy[] = {-1, 1, 0, 0};
    
    for (int y = 0; y < rows; y++) {
        for (int x = 0; x < cols; x++) {
            if (grid[y][x] == 1) continue;
            
            int noeudId = coordsToId(x, y, cols);
            
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];
                
                if (nx >= 0 && nx < cols && 
                    ny >= 0 && ny < rows && 
                    grid[ny][nx] == 0) {
                    
                    int voisinId = coordsToId(nx, ny, cols);
                    graphe.ajouterArete(noeudId, voisinId, 1);
                }
            }
        }
    }
    
    return graphe;
}

// ========== NOUVELLE VERSION findPathDijkstra ==========

val findPathDijkstra(val gridJS, int startX, int startY, int endX, int endY) {
    int cols = gridJS[0]["length"].as<int>();
    
    Graphe graphe = convertirGrilleEnGraphe(gridJS);
    
    int startId = coordsToId(startX, startY, cols);
    int endId = coordsToId(endX, endY, cols);
    
    DijkstraResult resultat = Dijkstra::trouverCheminAvecStats(graphe, startId, endId);
    
    val pathArray = val::array();
    for (int nodeId : resultat.chemin) {
        Coords coords = idToCoords(nodeId, cols);
        val point = val::object();
        point.set("x", coords.x);
        point.set("y", coords.y);
        pathArray.call<void>("push", point);
    }
    
    val visitedArray = val::array();
    for (int nodeId : resultat.noeudsVisites) {
        Coords coords = idToCoords(nodeId, cols);
        val point = val::object();
        point.set("x", coords.x);
        point.set("y", coords.y);
        visitedArray.call<void>("push", point);
    }
    
    val result = val::object();
    result.set("path", pathArray);
    result.set("visited", visitedArray);
    result.set("exploredCells", resultat.casesExplorees);
    result.set("timeMs", resultat.tempsMs);
    
    return result;
}

// ========== BINDINGS ==========

EMSCRIPTEN_BINDINGS(pathfinding_module) {
    emscripten::function("findPathAStar", &findPathAStar);
    emscripten::function("findPathDijkstra", &findPathDijkstra);
}