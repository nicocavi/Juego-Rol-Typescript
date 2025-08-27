import { Player } from './player';

export class Camera {
  x: number;
  y: number;
  smooth: number;
  deadzone: number;
  private targetX = 0;
  private targetY = 0;
  private moveTimer: number; // acumulador de tiempo
  private delay: number; // tiempo mínimo antes de empezar a mover
  viewportWidth = 20;
  viewportHeight = 20;
  tileSize: number;

  constructor(
    viewportWidth: number,
    viewportHeight: number,
    tileSize: number,
    smooth: number = 2,
    deadzone: number = 20,
  ) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.smooth = smooth;
    this.deadzone = deadzone; // margen para evitar movimientos pequeños
    this.moveTimer = 0;
    this.delay = 0.15;
    this.tileSize = tileSize;
  }

  follow(player: Player, deltaTime: number) {
    const vel = player.vel;
    const speed = vel.length();

    if (speed > this.deadzone) {
      // si el jugador se está moviendo más allá del deadzone
      this.moveTimer += deltaTime;

      if (this.moveTimer >= this.delay) {
        // target = posición del player (centrado en la pantalla)

        this.targetX = player.x - this.viewportWidth * this.tileSize / 2;
        this.targetY = player.y - this.viewportHeight * this.tileSize / 2;
      }
    } else {
      // si está quieto, reseteamos el timer
      this.moveTimer = 0;
    }

    // interpolamos suavemente hacia el target
    const deltaX = (this.targetX - this.x) * this.smooth * deltaTime;
    const deltaY = (this.targetY - this.y) * this.smooth * deltaTime;
    this.x += deltaX + this.x >= 0 ? deltaX : 0;
    this.y += deltaY + this.y >= 0 ? deltaY : 0;
  }

  // Convierte coordenadas del mundo a coordenadas de pantalla
  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: wx - this.x,
      y: wy - this.y,
    };
  }

  viewInCamera(x: number, y: number, width: number, height: number): boolean {
    const left1   = this.x;
    const right1  = this.x + (this.viewportWidth + 1) * this.tileSize;
    const top1    = this.y;
    const bottom1 = this.y + (this.viewportHeight + 1) * this.tileSize;
  
    // coordenadas de los bordes de 
    const left2   = x;
    const right2  = x + width;
    const top2    = y;
    const bottom2 = y + height;
  
    // comprobar intersección (si se superponen en x e y)
    const overlapX = left1 <= right2 && right1 >= left2;
    const overlapY = top1 <= bottom2 && bottom1 >= top2;
  
    return overlapX && overlapY;
  }
}
