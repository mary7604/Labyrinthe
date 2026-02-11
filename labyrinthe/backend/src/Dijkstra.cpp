#include "Dijkstra.h"
#include <queue>
#include <map>
#include <climits>
#include <algorithm>
#include <chrono>

using namespace std;

struct NoeudDijkstra {
    int id;
    int distance;
    
    bool operator>(const NoeudDijkstra& autre) const {
        return distance > autre.distance;
    }
};

DijkstraResult Dijkstra::trouverCheminAvecStats(
    const Graphe& graphe,
    int noeudDepart,
    int noeudArrivee
) {
    auto debut = chrono::high_resolution_clock::now();
    
    map<int, int> distances;
    map<int, int> parents;
    priority_queue<NoeudDijkstra, vector<NoeudDijkstra>, greater<NoeudDijkstra>> pq;
    
    distances[noeudDepart] = 0;
    pq.push({noeudDepart, 0});
    
    vector<int> noeudsVisites;
    
    while (!pq.empty()) {
        NoeudDijkstra courant = pq.top();
        pq.pop();
        
        if (distances.count(courant.id) && courant.distance > distances[courant.id]) 
            continue;
        
        noeudsVisites.push_back(courant.id);
        
        if (courant.id == noeudArrivee) break;
        
        for (const Arete& arete : graphe.getVoisins(courant.id)) {
            int voisin = arete.destination;
            int nouvelleDist = distances[courant.id] + arete.poids;
            
            if (!distances.count(voisin) || nouvelleDist < distances[voisin]) {
                distances[voisin] = nouvelleDist;
                parents[voisin] = courant.id;
                pq.push({voisin, nouvelleDist});
            }
        }
    }
    
    vector<int> chemin;
    if (distances.count(noeudArrivee)) {
        int noeud = noeudArrivee;
        while (noeud != noeudDepart) {
            chemin.push_back(noeud);
            if (!parents.count(noeud)) break;
            noeud = parents[noeud];
        }
        chemin.push_back(noeudDepart);
        reverse(chemin.begin(), chemin.end());
    }
    
    auto fin = chrono::high_resolution_clock::now();
    double tempsMs = chrono::duration<double, milli>(fin - debut).count();
    
    return {chemin, noeudsVisites, (int)noeudsVisites.size(), tempsMs};
}