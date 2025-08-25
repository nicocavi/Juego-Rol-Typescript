import { GameObjectType } from "../model/gameObject";
import { NPC } from "../model/npc";

const collider = {
    origin: { x: 2, y: 12 },
    width: 12,
    height: 4,
}

export const reptile = new NPC(
    200, // gid
    100, // x
    150, // y
    16, // width
    16, // height
    0, // sx
    0, // sy
    16, // dWidth
    16, // dHeight
    GameObjectType.NPC, // type
    {
        accel: 2000,
        maxSpeed: 30,
        friction: 0.05,
        gravity: undefined,
        jumpSpeed: undefined,
    }, // cfg
    'Reptile', // name
    100, // hp
    100, // maxHp
    'tileset_reptile.json', // tileset
    40,
    1.5,
    collider
);
