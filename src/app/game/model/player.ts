import { GameObject } from "./gameObject";

export class Player implements GameObject {

    id: string;
    name: string;
    lvl: number;
    exp: number;
    speed = 2;
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    width: number;
    height: number;
    sprite: HTMLImageElement;
    direction: 'up' | 'down' | 'left' | 'right' = 'down';
    isMoving = false;

    constructor(
        name: string,
        hp: number,
        maxHp: number,
        x: number,
        y: number,
        width: number,
        height: number,
        urlTileset: string
    ) {
        this.id = '1';
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