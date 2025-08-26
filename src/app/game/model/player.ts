import { Collider } from './collider';
import { Direction } from './direction';
import { Entity } from './entity';
import { GameObjectType } from './gameObject';
import { Input } from './input';
import { MovementConfig } from './movementConfig';
import { Vec2 } from './vec2';

const collider = {
  origin: { x: 0, y: 12 },
  width: 16,
  height: 4,
}

export class Player extends Entity {
  lvl: number;
  exp: number;
  input: Input;

  constructor(
    cfg: MovementConfig,
    input: Input,
    name: string,
    hp: number,
    maxHp: number,
    x: number,
    y: number,
    width: number,
    height: number,
    tileset: string
  ) {
    super(100001, x, y, width, height, 0, 0, 16, 16, GameObjectType.PLAYER, cfg, name, hp, maxHp, tileset, collider);
    this.input = input;
    this.name = name;
    this.lvl = 1;
    this.exp = 0;
    this.hp = hp;
    this.maxHp = maxHp;
  }

  override update(dt: number) {
    this.updateMovementParameters(dt);
    // Integración de posición
    const pos = new Vec2(this.x, this.y);
    pos.add(this.vel.clone().scale(dt));
    this.x = pos.x;
    this.y = pos.y;

    this.updateDirection();

    this.updateAnimation(dt);
  }

  private updateMovementParameters(dt: number) {
    const dir = this.input.axisTopDown;
    if (dir.length() > 0) {
      dir.normalize();
      // aceleración hacia la dirección de entrada
      this.vel.x += dir.x * this.cfg.accel * dt;
      this.vel.y += dir.y * this.cfg.accel * dt;
      // clamp de velocidad
      const speed = this.vel.length();
      if (speed > this.cfg.maxSpeed)
        this.vel.normalize().scale(this.cfg.maxSpeed);
    } else {
      // fricción exponencial (suaviza la detención)
      const f = Math.pow(this.cfg.friction, dt); // fricción por segundo a fricción por dt
      this.vel.scale(f);
      if (this.vel.length() < 1e-2) this.vel.set(0, 0);
    }
  }

  private updateDirection() {
    const axis = this.input.axisTopDown;

    if (Math.abs(axis.x) > Math.abs(axis.y)) {
      // horizontal domina
      this.dir = axis.x > 0 ? Direction.Right : Direction.Left;
    } else if (axis.y !== 0) {
      this.dir = axis.y > 0 ? Direction.Down : Direction.Up;
    }
  }

  private updateAnimation(dt: number) {
    // supongamos que cada dirección está en una fila distinta de la sheet
    this.sx = this.dir * this.height;

    // si el jugador se está moviendo, avanzar frame
    if (this.vel.length() > 1) {
      this.frame += dt * 10; // velocidad de animación (10 fps)
      this.sy = (Math.floor(this.frame) % 4) * this.width; // si hay 4 frames por fila
    } else {
      // quieto → frame inicial
      this.sy = 0;
      this.frame = 0;
    }
  }

  takeDamage(damage: number): void {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
      console.log(`${this.name} ha sido derrotado!`);
    } else {
      console.log(`${this.name} recibió ${damage} puntos de daño. HP restante: ${this.hp}`);
    }
  }
}
