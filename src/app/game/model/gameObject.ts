import { v4 as uuidv4 } from 'uuid';
import { Collider } from './collider';

export enum GameObjectType {
    PLAYER = "player",
    NPC = "npc",
    BULLET = "bullet",
    OBSTACLE = "obstacle"
}

export class GameObject {
    id: string;
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: GameObjectType;
    sx: number;
    sy: number;
    dWidth: number;
    dHeight: number;
    tileset?: string;
    collider?: Collider;

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
        type = GameObjectType.OBSTACLE,
        collider?: Collider,
        tileset?: string,
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
        this.tileset = tileset;
        this.collider = collider;
        this.type = type;
    }
}