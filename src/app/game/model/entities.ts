import { Entity } from "./entity";
import { GameObject } from "./gameObject";
import { TerrainObject } from "./terrainObject";

export interface Entities {
    terrain: TerrainObject[][];
    objects: GameObject[][];
    entities: Entity[];
}