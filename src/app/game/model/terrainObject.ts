import { GameObject } from "./gameObject";

export interface TerrainObject extends GameObject {
    tileX: number;
    tileY: number;
}