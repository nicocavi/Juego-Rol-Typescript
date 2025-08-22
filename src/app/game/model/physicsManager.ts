// collisionManager.ts

import { GameObject } from "./gameObject";

const collisionMatrix: Record<string, string[]> = {
  player: ["npc", "obstacle"],
  npc: ["player", "bullet"],
  bullet: ["npc", "player"],
};

export class PhysicsManager {
  update(entities: GameObject[]) {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];

        if (collisionMatrix[a.type]?.includes(b.type)) {
          if (this.overlap(a, b)) this.resolve(a, b);
        }
      }
    }
  }

  private overlap(a: GameObject, b: GameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
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
