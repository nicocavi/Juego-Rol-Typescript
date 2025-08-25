import { Collider } from './collider';
import { Direction } from './direction';
import { Entity } from './entity';
import { GameObjectType } from './gameObject';
import { MovementConfig } from './movementConfig';
import { Player } from './player';
import { Vec2 } from './vec2';

export class NPC extends Entity {
  attackRange: number;
  attackCooldown: number;
  private attackTimer: number;
  private target: Player | null = null;

  constructor(
    gid: number,
    x: number,
    y: number,
    width: number,
    height: number,
    sx: number,
    sy: number,
    dWidth: number,
    dHeight: number,
    type: GameObjectType,
    cfg: MovementConfig,
    name: string,
    hp: number,
    maxHp: number,
    tileset: string,
    attackRange: number = 40,
    attackCooldown: number = 1.5,
    collider?: Collider
  ) {
    super(
      gid,
      x,
      y,
      width,
      height,
      sx,
      sy,
      dWidth,
      dHeight,
      type,
      cfg,
      name,
      hp,
      maxHp,
      tileset,
      collider
    );
    this.cfg = cfg;
    this.name = name;
    this.hp = hp;
    this.maxHp = maxHp;
    this.attackRange = attackRange;
    this.attackCooldown = attackCooldown; // segundos
    this.attackTimer = 0;
  }

  override update(dt: number) {
    if (this.target) {
      const dir = new Vec2(this.target.x - this.x, this.target.y - this.y);
      const dist = dir.length();

      if (dist > this.attackRange) {
        // mover en dirección al player
        dir.normalize();
        this.vel = new Vec2(dir.x * this.cfg.maxSpeed, dir.y * this.cfg.maxSpeed);

        // usar magnitud de this.vel como "velocidad base"
        const move = dir.clone().scale(this.vel.length() * dt);

        this.x += move.x;
        this.y += move.y;
        this.updateDirection(dir);
        this.updateAnimation(dt);
      } else {
        // dentro del rango => atacar
        this.sy = 0;
        this.frame = 0;
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.attack(this.target);
          this.attackTimer = this.attackCooldown;
        }
      }
    }
  }

  attack(player: Player) {
    console.log('NPC atacó al player!');
    player.takeDamage(10); // asumimos que el player tiene un método de daño
  }

  setTarget(player: Player | null) {
    this.target = player;
  }

  private updateAnimation(dt: number) {
    // supongamos que cada dirección está en una fila distinta de la sheet
    this.sx = this.dir * this.height;

    // si el jugador se está moviendo, avanzar frame
    if (this.vel.length() > 1) {
      this.frame += dt * 10; // velocidad de animación (10 fps)
      this.sy = (Math.floor(this.frame) % 4) * this.width; // si hay 4 frames por fila
    }
  }

  private updateDirection(dir: Vec2) {
      const axis = dir;
      if (Math.abs(axis.x) > Math.abs(axis.y)) {
        // horizontal domina
        this.dir = axis.x > 0 ? Direction.Right : Direction.Left;
      } else if (axis.y !== 0) {
        this.dir = axis.y > 0 ? Direction.Down : Direction.Up;
      }
    }
}
