import { GameObject } from "./gameObject";

export class Player implements GameObject {

    gid: number;
    name: string;
    lvl: number;
    exp: number;
    speed = 2;
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    dx: number = 1;
    dy: number = 0;
    width: number;
    height: number;
    direction: 'up' | 'down' | 'left' | 'right' = 'down';
    isMoving = false;
    sx = 0;
    sy = 0;
    dWidth = 16;
    dHeight = 16;
    collidable?: boolean | undefined;
    tileset: string;

    constructor(
        name: string,
        hp: number,
        maxHp: number,
        x: number,
        y: number,
        width: number,
        height: number,
        tileset: string
    ) {
        this.gid = 101; // Reservo los primeros 100 para tiles de recursos
        this.name = name;
        this.lvl = 1;
        this.exp = 0;
        this.hp = hp;
        this.maxHp = maxHp;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tileset = tileset;
    }
   
    update(keys: Set<string>) {
        if (keys.has("w")) {
            this.y -= this.speed;
            this.sx = this.dHeight;
            this.sy = this.sy <= this.dHeight * 4 ? this.sy + this.dHeight : 0;
        };
        if (keys.has("s")) {
            this.y += this.speed;
            this.sx = 0;
            this.sy = this.sy <= this.dHeight * 4 ? this.sy + this.dHeight : 0;
        }
        if (keys.has("a")) {
            this.x -= this.speed;
            this.sx = this.dHeight * 2;
            this.sy = this.sy <= this.dHeight * 4 ? this.sy + this.dHeight : 0;
        }
        if (keys.has("d")) {
            this.x += this.speed;
            this.sx = this.dHeight * 3;
            this.sy = this.sy <= this.dHeight * 4 ? this.sy + this.dHeight : 0;
        }

    }

}