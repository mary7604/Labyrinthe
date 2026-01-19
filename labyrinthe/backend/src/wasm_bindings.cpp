#include <emscripten/bind.h>
#include "Labyrinthe.h"
#include "Dijkstra.h"

using namespace emscripten;

struct PathResult {
    std::vector<val> path;
    int exploredCells;
    double timeMs;
};

PathResult findPathDijkstra(
    const val& gridJS,
    int startX, int startY,
    int endX, int endY
) {
    int rows = gridJS["length"].as<int>();
    int cols = gridJS[0]["length"].as<int>();
    
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols));
    
    for (int y = 0; y < rows; y++) {
        val row = gridJS[y];
        for (int x = 0; x < cols; x++) {
            grid[y][x] = row[x].as<int>();
        }
    }
    
    Labyrinthe lab(grid);
    Dijkstra dijkstra(lab);
    
    auto result = dijkstra.trouverCheminAvecStats(startX, startY, endX, endY);
    
    std::vector<val> pathJS;
    for (const auto& point : result.chemin) {
        val obj = val::object();
        obj.set("x", point.first);
        obj.set("y", point.second);
        pathJS.push_back(obj);
    }
    
    return {pathJS, result.casesExplorees, result.tempsMs};
}

EMSCRIPTEN_BINDINGS(pathfinding_module) {
    value_object<PathResult>("PathResult")
        .field("path", &PathResult::path)
        .field("exploredCells", &PathResult::exploredCells)
        .field("timeMs", &PathResult::timeMs);
    
    function("findPathDijkstra", &findPathDijkstra);
    
    register_vector<val>("VectorVal");
}