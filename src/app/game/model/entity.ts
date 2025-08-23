import { Direction } from './direction';
import { GameObject, GameObjectType } from './gameObject';
import { MovementConfig } from './movementConfig';
import { Vec2 } from './vec2';

export class Entity extends GameObject {
  vx = 0; // Velocidad en X
  vy = 0; // Velocidad en Y
  cfg: MovementConfig;
  vel = new Vec2(0, 0);
  dir: Direction = Direction.Down;
  frame = 0;
  hp: number;
  maxHp: number;
  direction: Direction;
  name: string;

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
    direction: Direction = Direction.Down
  ) {
    super(gid, x, y, width, height, sx, sy, dWidth, dHeight, type, true, tileset);
    this.cfg = cfg;
    this.name = name;
    this.hp = hp;
    this.maxHp = maxHp;
    this.direction = direction;
  }

  update(dt:number): void {}
}
