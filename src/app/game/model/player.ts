import { GameObject } from "./gameObject";

export class Player implements GameObject {

    gid: number;
    name: string;
    lvl: number;
    exp: number;
    speed = 5;
    hp: number;
    maxHp: number;
    x: number;
    y: number;
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
   


}