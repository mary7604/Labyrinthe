#ifndef LABYRINTHE_H
#define LABYRINTHE_H

#include <vector>

class Labyrinthe {
private:
    int largeur, hauteur;
    std::vector<std::vector<int>> grille;

public:
    Labyrinthe(int l, int h);
    Labyrinthe(const std::vector<std::vector<int>>& g);
    
    int getLargeur() const { return largeur; }
    int getHauteur() const { return hauteur; }
    int getCase(int x, int y) const;
    bool estValide(int x, int y) const;
    
    const std::vector<std::vector<int>>& getGrille() const { return grille; }
};

#endif