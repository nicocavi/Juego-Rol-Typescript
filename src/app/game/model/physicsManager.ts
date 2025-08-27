// collisionManager.ts

import { Entity } from "./entity";
import { GameObject } from "./gameObject";

const collisionMatrix: Record<string, string[]> = {
  player: ["npc", "obstacle"],
  npc: ["player", "bullet"],
  bullet: ["npc", "player"],
};

export class PhysicsManager {

  checkCollisions(movingObject: GameObject, objects: GameObject[]): GameObject[] {
    const collisions: GameObject[] = [];

    for (const obj of objects) {
      if (obj === movingObject) continue; // no colisiona consigo mismo
      if (this.overlap(movingObject, obj)) {
        collisions.push(obj);
      }
    }

    return collisions;
  }

  private getCollider(obj: GameObject): {x: number, y: number, width: number, height: number} | null {
    if(obj.collider){
      return {
        x: obj.collider.origin.x + obj.x,
        y: obj.collider.origin.y + obj.y,
        width: obj.collider.width,
        height: obj.collider.height
      };
    }

    return null;
  }

  private overlap(obj1: GameObject, obj2: GameObject): boolean {

    const a = this.getCollider(obj1);
    const b = this.getCollider(obj2);

    if(!a || !b) return false;
    
    return !!(
      (a.x < b.x + b.width &&
      a.x + a.width > b.x) &&
      (a.y < b.y + b.height &&
      a.y + a.height > b.y)
    );
  }

  private resolve(a: GameObject, b: GameObject) {
    // lógica según tipos
    if (a.type === "bullet" && b.type === "npc") {
      console.log(`NPC ${b.id} fue golpeado por bala ${a.id}`);
      // eliminar bala, reducir vida del NPC...
    } else if (a.type === "player" && b.type === "npc") {
      console.log("Jugador colisionó con NPC");
    } else if (a.type === "player" && b.type === "obstacle") {
      // empujar jugador fuera del obstáculo
    }
  }
}
