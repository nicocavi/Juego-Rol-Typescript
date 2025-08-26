import { Entity } from "./entity";
import { Grid, Node } from "./grid";

export class PathFinder {
    private openList: Node[] = [];
    private closedList: Node[] = [];

    find(origin: Entity, target: Entity, grid: Grid): { x: number; y: number }[] {
        this.openList = [];
        this.closedList = [];

        const startX = Math.floor(origin.x / grid.tileSize);
        const startY = Math.floor(origin.y / grid.tileSize);
        const endX = Math.floor(target.x / grid.tileSize);
        const endY = Math.floor(target.y / grid.tileSize);

        const startNode: Node = {
            x: startX,
            y: startY,
            g: 0,
            h: this.heuristic(startX, startY, endX, endY),
            f: 0,
        };
        startNode.f = startNode.g + startNode.h;
        this.openList.push(startNode);

        while (this.openList.length > 0) {
            // Obtener el nodo con el menor f
            this.openList.sort((a, b) => a.f - b.f);
            const currentNode = this.openList.shift()!;
            this.closedList.push(currentNode);

            // Si hemos llegado al objetivo, reconstruir el camino
            if (currentNode.x === endX && currentNode.y === endY) {
                return this.reconstructPath(currentNode);
            }

            // Obtener vecinos
            const neighbors = this.getNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                if (this.closedList.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    continue; // ya evaluado
                }

                const tentativeG = currentNode.g + 1; // costo de moverse a un vecino

                let openNode = this.openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (!openNode) {
                    openNode = {
                        x: neighbor.x,
                        y: neighbor.y,
                        g: tentativeG,
                        h: this.heuristic(neighbor.x, neighbor.y, endX, endY),
                        f: 0,
                        parent: currentNode,
                    };
                    openNode.f = openNode.g + openNode.h;
                    this.openList.push(openNode);
                } else if (tentativeG < openNode.g) {
                    // Mejor camino encontrado
                    openNode.g = tentativeG;
                    openNode.f = openNode.g + openNode.h;
                    openNode.parent = currentNode;
                }
            }
        }
        return []; // no se encontró camino
    }
    private heuristic(x1: number, y1: number, x2: number, y2: number): number {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2); // distancia Manhattan
    }
    private getNeighbors(node: Node, grid: Grid): { x: number; y: number }[] {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // arriba
            { x: 1, y: 0 },  // derecha
            { x: 0, y: 1 },  // abajo
            { x: -1, y: 0 }, // izquierda
        ];

        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;
            if (grid.isWalkable(newX, newY)) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        return neighbors;
    }
    private reconstructPath(node: Node): { x: number; y: number }[] {
        const path = [];
        let currentNode: Node | undefined = node;
        while (currentNode) {
            path.push({ x: currentNode.x, y: currentNode.y });
            currentNode = currentNode.parent;
        }
        return path.reverse();
    }
}
