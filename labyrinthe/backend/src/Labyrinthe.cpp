#include "Labyrinthe.h"

Labyrinthe::Labyrinthe(int l, int h) : largeur(l), hauteur(h) {
    grille.resize(hauteur, std::vector<int>(largeur, 0));
}

Labyrinthe::Labyrinthe(const std::vector<std::vector<int>>& g) 
    : grille(g), hauteur(g.size()), largeur(g.empty() ? 0 : g[0].size()) {}

int Labyrinthe::getCase(int x, int y) const {
    if (estValide(x, y))
        return grille[y][x];
    return -1;
}

bool Labyrinthe::estValide(int x, int y) const {
    return x >= 0 && x < largeur && y >= 0 && y < hauteur;
}