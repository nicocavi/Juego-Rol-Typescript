import { Player } from './player';

export class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  smooth: number;
  deadzone: number;
  private targetX = 0;
  private targetY = 0;
  private moveTimer: number; // acumulador de tiempo
  private delay: number; // tiempo mínimo antes de empezar a mover

  constructor(
    width: number,
    height: number,
    smooth: number = 2,
    deadzone: number = 20
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.smooth = smooth;
    this.deadzone = deadzone; // margen para evitar movimientos pequeños
    this.moveTimer = 0;
    this.delay = 0.15;
  }

  follow(player: Player, deltaTime: number) {
    const vel = player.vel;
    const speed = vel.length();
  
    if (speed > this.deadzone) {
      // si el jugador se está moviendo más allá del deadzone
      this.moveTimer += deltaTime;
  
      if (this.moveTimer >= this.delay) {
        // target = posición del player (centrado en la pantalla)

        this.targetX = player.x - this.width / 6;
        this.targetY = player.y - this.height / 6;
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
}
