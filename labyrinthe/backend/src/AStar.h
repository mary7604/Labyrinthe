#ifndef ASTAR_H
#define ASTAR_H

#include <emscripten/bind.h>

using namespace emscripten;

// Déclaration de la fonction A*
val findPathAStar(val gridJS, int startX, int startY, int endX, int endY);

#endif // ASTAR_H