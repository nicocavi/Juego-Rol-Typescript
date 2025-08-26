import { Collider } from './collider';
import { Direction } from './direction';
import { Entity } from './entity';
import { GameObjectType } from './gameObject';
import { Grid } from './grid';
import { MovementConfig } from './movementConfig';
import { PathFinder } from './pathFinder';
import { Player } from './player';
import { Vec2 } from './vec2';

const EPSILON = 1; // tolerancia en píxeles
const NPC_SPEED = 2; // velocidad de movimiento
export class NPC extends Entity {
  attackRange: number;
  attackCooldown: number;
  private target: Entity | null = null;
  private path: { x: number; y: number }[] = [];
  private pathFinder = new PathFinder();

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
    collider?: Collider,
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
  }

  override update(dt: number) {
    if(this.path.length > 0){ 
      console.log('NPC siguiendo path: ', this.path);

      const nextNode = this.path[this.path.length - 1]; // siguiente nodo en el path
      const targetPos = new Vec2(nextNode.x * 16 + 8, nextNode.y * 16 + 8); // centro del tile
      
      const toTarget = targetPos.subtract(new Vec2(this.x + this.width / 2, this.y + this.height / 2));
      const distance = toTarget.length();
      if (distance < EPSILON) {
        // llegó al nodo, quitarlo del path
        this.path.pop();
        if (this.path.length === 0) {
          this.vel = new Vec2(0, 0); // detenerse al llegar
        }
      } else {
        // mover hacia el nodo
        const direction = toTarget.normalize();
        this.vel = direction.scale(NPC_SPEED);
      }
      // aplicar movimiento
      this.x += this.vel.x;
      this.y += this.vel.y;

      this.updateAnimation(dt);
      this.updateDirection(this.vel);
    }

  }

  attack(player: Player) {
    console.log('NPC atacó al player!');
    player.takeDamage(10); // asumimos que el player tiene un método de daño
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

  follow(target: Entity, grid: Grid) {
    this.target = target;
    this.path = this.pathFinder.find(this, target, grid);
    console.log("Busqueda de path: ", this.path);
    console.log("Busqueda de path: ", {target, grid});
  }


  get start(): {x: number, y: number} {
    return {
      x: Math.floor(this.x / 16),
      y: Math.floor(this.y / 16),
    };
  }

  get end(): {x: number, y: number} {
    if (!this.target) return this.start;
    return {
      x: Math.floor(this.target.x / 16),
      y: Math.floor(this.target.y / 16),
    };
  }
}
