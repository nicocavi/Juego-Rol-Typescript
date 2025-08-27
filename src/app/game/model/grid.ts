import { Collider } from './collider';
import { GameObject } from './gameObject';

export type Node = {
  x: number;
  y: number;
  g: number; // coste desde inicio
  h: number; // heurística (distancia estimada al objetivo)
  f: number; // g + h
  parent?: Node;
};

export class Grid {
  width: number;
  height: number;
  cells: number[][]; // 0 = libre, 1 = bloqueado
  tileSize: number = 16;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () => Array(width).fill(0));
  }

  isWalkable(x: number, y: number): boolean {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.width &&
      y < this.height &&
      this.cells[y][x] === 0
    );
  }

  initializeGrid(
    mapWidth: number,
    mapHeight: number,
    gameObjects: GameObject[]
  ): void {
    // grid inicial, todas las celdas son transitables (1 = walkable, 0 = bloqueado)
    const grid: number[][] = Array.from({ length: mapHeight }, () =>
      Array(mapWidth).fill(0)
    );

    for (const obj of gameObjects) {
      if (obj.collider) {
        console.log('Collider found:', obj);
        grid[Math.floor(obj.y / this.tileSize)][Math.floor(obj.x / this.tileSize)] = 1;
      }
    }
    this.cells = grid;
  }

  // función auxiliar: colisión entre dos rectángulos
  rectIntersect(
    a: { x: number; y: number; width: number; height: number },
    b: Collider
  ): boolean {
    return (
      a.x < b.origin.x + b.width &&
      a.x + a.width > b.origin.x &&
      a.y < b.origin.y + b.height &&
      a.y + a.height > b.origin.y
    );
  }
}
