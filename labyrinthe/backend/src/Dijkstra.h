#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include "Graphe.h"
#include <vector>

struct DijkstraResult {
    std::vector<int> chemin;           // IDs des nœuds
    std::vector<int> noeudsVisites;    // IDs des nœuds visités
    int casesExplorees;
    double tempsMs;
};

class Dijkstra {
public:
    static DijkstraResult trouverCheminAvecStats(
        const Graphe& graphe,
        int noeudDepart,
        int noeudArrivee
    );
};

#endif