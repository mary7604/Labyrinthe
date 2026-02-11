#ifndef GRAPHE_H
#define GRAPHE_H

#include <vector>
#include <map>
using namespace std;

struct Arete {
    int destination;
    int poids;
    
    Arete(int dest, int p = 1) : destination(dest), poids(p) {}
};

class Graphe {
private:
    int nbNoeuds;
    map<int, vector<Arete>> adjacence;
    
public:
    Graphe(int n = 0) : nbNoeuds(n) {}
    
    void ajouterArete(int source, int destination, int poids = 1) {
        adjacence[source].push_back(Arete(destination, poids));
    }
    
    const vector<Arete>& getVoisins(int noeud) const {
        static const vector<Arete> vide;
        auto it = adjacence.find(noeud);
        return (it != adjacence.end()) ? it->second : vide;
    }
    
    int getNbNoeuds() const { return nbNoeuds; }
};

#endif