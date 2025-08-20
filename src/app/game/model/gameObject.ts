export interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    sprite: HTMLImageElement;
    collidable?: boolean;
}