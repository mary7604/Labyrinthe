#include <emscripten/bind.h>
#include <queue>
#include <cmath>
#include <chrono>
#include <set>
#include <vector>

using namespace emscripten;

// Représente une cellule de la grille
struct Point {
    int x, y;
    Point(int x = 0, int y = 0) : x(x), y(y) {}
};

// Nœud utilisé par l’algorithme A*
struct Node {
    Point pos;        // position dans la grille
    double g, h;      // g = coût réel, h = heuristique
    Node* parent;     // pour reconstruire le chemin
    
    Node(Point p, double g, double h, Node* parent = nullptr)
        : pos(p), g(g), h(h), parent(parent) {}
    
    double f() const { return g + h; } // score total
};

// Pour choisir le nœud avec le plus petit f
struct CompareNode {
    bool operator()(Node* a, Node* b) const {
        return a->f() > b->f();
    }
};

// Heuristique : distance de Manhattan
double heuristic(Point a, Point b) {
    return std::abs(a.x - b.x) + std::abs(a.y - b.y);
}

// Fonction principale appelée depuis JavaScript
val findPathAStar(val gridJS, int startX, int startY, int endX, int endY) {
    auto start = std::chrono::high_resolution_clock::now();

    // Conversion de la grille JS en grille C++
    int rows = gridJS["length"].as<int>();
    int cols = gridJS[0]["length"].as<int>();
    
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols));
    for (int y = 0; y < rows; y++)
        for (int x = 0; x < cols; x++)
            grid[y][x] = gridJS[y][x].as<int>();

    // Initialisation
    Point start_pos(startX, startY);
    Point end_pos(endX, endY);

    std::priority_queue<Node*, std::vector<Node*>, CompareNode> openSet;
    std::set<std::pair<int,int>> closedSet;
    std::vector<Point> visitedCells;

    Node* startNode = new Node(start_pos, 0, heuristic(start_pos, end_pos));
    openSet.push(startNode);

    std::vector<Node*> allNodes;
    allNodes.push_back(startNode);

    // Déplacements possibles (haut, droite, bas, gauche)
    const int dx[] = {0, 1, 0, -1};
    const int dy[] = {-1, 0, 1, 0};

    Node* goalNode = nullptr;

    // Boucle principale A*
    while (!openSet.empty()) {
        Node* current = openSet.top();
        openSet.pop();

        // Ignorer si déjà visité
        if (closedSet.count({current->pos.x, current->pos.y}))
            continue;

        visitedCells.push_back(current->pos);
        closedSet.insert({current->pos.x, current->pos.y});

        // Arrivée atteinte
        if (current->pos.x == end_pos.x && current->pos.y == end_pos.y) {
            goalNode = current;
            break;
        }

        // Explorer les voisins
        for (int i = 0; i < 4; i++) {
            int nx = current->pos.x + dx[i];
            int ny = current->pos.y + dy[i];

            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            if (grid[ny][nx] == 1) continue;
            if (closedSet.count({nx, ny})) continue;

            double newG = current->g + 1;
            double h = heuristic(Point(nx, ny), end_pos);

            Node* neighbor = new Node(Point(nx, ny), newG, h, current);
            allNodes.push_back(neighbor);
            openSet.push(neighbor);
        }
    }

    // Reconstruction du chemin final
    std::vector<Point> path;
    if (goalNode) {
        Node* current = goalNode;
        while (current) {
            path.insert(path.begin(), current->pos);
            current = current->parent;
        }
    }

    auto end = std::chrono::high_resolution_clock::now();
    double timeMs = std::chrono::duration<double, std::milli>(end - start).count();

    // Création du résultat pour JavaScript
    val result = val::object();
    val pathArray = val::array();
    val visitedArray = val::array();

    for (const auto& p : path) {
        val point = val::object();
        point.set("x", p.x);
        point.set("y", p.y);
        pathArray.call<void>("push", point);
    }

    for (const auto& v : visitedCells) {
        val point = val::object();
        point.set("x", v.x);
        point.set("y", v.y);
        visitedArray.call<void>("push", point);
    }

    result.set("path", pathArray);
    result.set("visited", visitedArray);
    result.set("exploredCells", (int)visitedCells.size());
    result.set("timeMs", timeMs);

    // Libération mémoire
    for (auto node : allNodes)
        delete node;

    return result;
}
