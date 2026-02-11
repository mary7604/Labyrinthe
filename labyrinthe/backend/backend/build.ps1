# Activation automatique d'Emscripten
$ErrorActionPreference = "Stop"

Write-Host "🔧 Activation d'Emscripten..." -ForegroundColor Yellow
C:\emsdk\emsdk_env.ps1

Write-Host "🔨 Compilation WASM en cours..." -ForegroundColor Cyan

emcc src/AStar.cpp src/Dijkstra.cpp src/wasm_bindings.cpp `
  -o ../frontend/src/wasm/pathfinding.js `
  -I./src `
  -std=c++17 `
  -s WASM=1 `
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' `
  -s ALLOW_MEMORY_GROWTH=1 `
  -s MODULARIZE=1 `
  -s EXPORT_ES6=1 `
  --bind `
  -O3

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation réussie!" -ForegroundColor Green
    Write-Host "📦 Fichiers générés:" -ForegroundColor Cyan
    Get-ChildItem ../frontend/src/wasm/pathfinding.*
} else {
    Write-Host "❌ Erreur de compilation" -ForegroundColor Red
    exit 1
}
#  cd backend
#   .\build.ps1

#cd ../frontend
#npm run dev
