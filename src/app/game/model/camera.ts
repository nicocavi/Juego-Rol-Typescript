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

  constructor(
    width: number,
    height: number,
    smooth: number = 0.1,
    deadzone: number = 20
  ) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.smooth = smooth;
    this.deadzone = deadzone; // margen para evitar movimientos pequeños
  }

  follow(player: Player) {
    // Si el jugador NO se está moviendo, no recalculamos el target
    if (player.vel.length()) {
      const {x, y} = player;
      // Movimiento con inercia hacia el target
      const dx = x - this.width / 8;
      const dy = y - this.height / 8;
      this.x = dx >= 0 ? dx : 0;
      this.y = dy >= 0 ? dy : 0;
    }

  }

  // Convierte coordenadas del mundo a coordenadas de pantalla
  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: wx - this.x,
      y: wy - this.y,
    };
  }
}
