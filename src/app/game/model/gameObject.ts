export interface GameObject {
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;
    sx: number;
    sy: number;
    dWidth: number;
    dHeight: number;
    tileset?: string;
    collidable?: boolean;
}