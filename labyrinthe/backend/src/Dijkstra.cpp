#include "Dijkstra.h"
#include <queue>
#include <climits>
#include <algorithm>
#include <chrono>

using namespace std;

struct Noeud {
    int x, y, distance;
    bool operator>(const Noeud& autre) const {
        return distance > autre.distance;
    }
};

BenchmarkResult Dijkstra::trouverCheminAvecStats(
    int startX, int startY, 
    int endX, int endY
) {
    auto debut = chrono::high_resolution_clock::now();
    
    int largeur = lab.getLargeur();
    int hauteur = lab.getHauteur();
    
    vector<vector<int>> distances(hauteur, vector<int>(largeur, INT_MAX));
    vector<vector<pair<int, int>>> parents(hauteur, vector<pair<int, int>>(largeur, {-1, -1}));
    
    priority_queue<Noeud, vector<Noeud>, greater<Noeud>> pq;
    
    distances[startY][startX] = 0;
    pq.push({startX, startY, 0});
    
    int casesExplorees = 0;
    constexpr int dx[] = {0, 0, -1, 1};
    constexpr int dy[] = {-1, 1, 0, 0};
    
    while (!pq.empty()) {
        Noeud courant = pq.top();
        pq.pop();
        
        casesExplorees++;
        
        if (courant.x == endX && courant.y == endY) break;
        
        if (courant.distance > distances[courant.y][courant.x]) continue;
        
        for (int i = 0; i < 4; i++) {
            int nx = courant.x + dx[i];
            int ny = courant.y + dy[i];
            
            if (nx >= 0 && nx < largeur && ny >= 0 && ny < hauteur &&
                lab.getCase(nx, ny) == 0) {
                
                int nouvelleDist = distances[courant.y][courant.x] + 1;
                
                if (nouvelleDist < distances[ny][nx]) {
                    distances[ny][nx] = nouvelleDist;
                    parents[ny][nx] = {courant.x, courant.y};
                    pq.push({nx, ny, nouvelleDist});
                }
            }
        }
    }
    
    vector<pair<int, int>> chemin;
    pair<int, int> pos = {endX, endY};
    
    if (distances[endY][endX] != INT_MAX) {
        while (pos.first != -1 && pos.second != -1) {
            chemin.push_back(pos);
            if (pos.first == startX && pos.second == startY) break;
            pos = parents[pos.second][pos.first];
        }
        reverse(chemin.begin(), chemin.end());
    }
    
    auto fin = chrono::high_resolution_clock::now();
    double tempsMs = chrono::duration<double, milli>(fin - debut).count();
    
    return {chemin, casesExplorees, tempsMs};
}