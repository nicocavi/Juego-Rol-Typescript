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
    sprite: HTMLImageElement;
    direction: 'up' | 'down' | 'left' | 'right' = 'down';
    isMoving = false;
    sx = 0;
    sy = 0;
    dWidth = 16;
    dHeight = 16;
    collidable?: boolean | undefined;

    constructor(
        name: string,
        hp: number,
        maxHp: number,
        x: number,
        y: number,
        width: number,
        height: number,
        urlTileset: string,
    ) {
        this.gid = 1;
        this.name = name;
        this.lvl = 1;
        this.exp = 0;
        this.hp = hp;
        this.maxHp = maxHp;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = urlTileset;
    }
   


}