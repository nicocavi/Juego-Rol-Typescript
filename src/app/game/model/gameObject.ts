import { v4 as uuidv4 } from 'uuid';
export class GameObject {
    id: string;
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;
    sx: number;
    sy: number;
    vx: number = 0;
    vy: number = 0; 
    dWidth: number;
    dHeight: number;
    isStatic: boolean;
    tileset?: string;
    collidable?: boolean;

    constructor(
        gid: number,
        x: number,
        y: number,
        width: number,
        height: number,
        sx: number = 0,
        sy: number = 0,
        dWidth: number = 16,
        dHeight: number = 16,
        isStatic: boolean = false,
        tileset?: string,
        collidable?: boolean
    ) {
        this.id = uuidv4();
        this.gid = gid;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sx = sx;
        this.sy = sy;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
        this.isStatic = isStatic;
        this.tileset = tileset;
        this.collidable = collidable;
    }
}