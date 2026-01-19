#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include "Labyrinthe.h"
#include <vector>
#include <utility>

struct BenchmarkResult {
    std::vector<std::pair<int, int>> chemin;
    int casesExplorees;
    double tempsMs;
};

class Dijkstra {
private:
    const Labyrinthe& lab;

public:
    explicit Dijkstra(const Labyrinthe& l) : lab(l) {}
    
    BenchmarkResult trouverCheminAvecStats(
        int startX, int startY, 
        int endX, int endY
    );
};

#endif