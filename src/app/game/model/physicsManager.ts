// collisionManager.ts

import { GameObject } from "./gameObject";

export class PhysicsManager {
  private staticObjects: GameObject[] = [];
  private dynamicObjects: GameObject[] = [];

  addObject(obj: GameObject) {
    if (obj.isStatic) {
      this.staticObjects.push(obj);
    } else {
      this.dynamicObjects.push(obj);
    }
  }

  removeObject(obj: GameObject) {
    if (obj.isStatic) {
      this.staticObjects = this.staticObjects.filter(o => o.id !== obj.id);
    } else {
      this.dynamicObjects = this.dynamicObjects.filter(o => o.id !== obj.id);
    }
  }

  // Verifica si dos objetos se solapan
  private isColliding(a: GameObject, b: GameObject): boolean {
    return !(
      a.x + a.width <= b.x ||
      a.x >= b.x + b.width ||
      a.y + a.height <= b.y ||
      a.y >= b.y + b.height
    );
  }

  // Resolver colisión empujando objetos dinámicos
  private resolveCollision(a: GameObject, b: GameObject) {
    const overlapX =
      (a.width / 2 + b.width / 2) - (Math.abs(a.x + a.width / 2 - (b.x + b.width / 2)));
    const overlapY =
      (a.height / 2 + b.height / 2) - (Math.abs(a.y + a.height / 2 - (b.y + b.height / 2)));

    if (overlapX > 0 && overlapY > 0) {
      if (overlapX < overlapY) {
        // Resolver en X
        if (a.x < b.x) {
          a.x -= overlapX / 2;
          b.x += overlapX / 2;
        } else {
          a.x += overlapX / 2;
          b.x -= overlapX / 2;
        }
        a.vx = 0;
        b.vx = 0;
      } else {
        // Resolver en Y
        if (a.y < b.y) {
          a.y -= overlapY / 2;
          b.y += overlapY / 2;
        } else {
          a.y += overlapY / 2;
          b.y -= overlapY / 2;
        }
        a.vy = 0;
        b.vy = 0;
      }
    }
  }

  update() {
    // 1) Dinámicos contra estáticos
    for (const dyn of this.dynamicObjects) {
      for (const stat of this.staticObjects) {
        if (this.isColliding(dyn, stat)) {
          this.resolveCollision(dyn, stat);
        }
      }
    }

    // 2) Dinámicos contra dinámicos
    for (let i = 0; i < this.dynamicObjects.length; i++) {
      for (let j = i + 1; j < this.dynamicObjects.length; j++) {
        const a = this.dynamicObjects[i];
        const b = this.dynamicObjects[j];
        if (this.isColliding(a, b)) {
          this.resolveCollision(a, b);
        }
      }
    }
  }
}
