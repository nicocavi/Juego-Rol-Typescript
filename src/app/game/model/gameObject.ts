export interface GameObject {
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;
    collidable?: boolean;
}