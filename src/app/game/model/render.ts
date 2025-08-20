import { GameObject } from "./gameObject";
import { MapJSON, TileSet } from "./types";

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Render {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    objects: GameObject[] = [];
    terrain: MapJSON;
    tileset!: TileSet;

    constructor(canvas: HTMLCanvasElement, terrain: MapJSON) {
        this.terrain = terrain;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    async load(): Promise<void> {
        this.tileset = await this.loadJSON<TileSet>(PATH_TILESETS+this.terrain.tilesets[0].source);
        this.objects = this.terrain.layers.find(layer => layer.type === 'objectgroup')?.objects || [];
    }

    addObject(object: GameObject): void {
        this.objects.push(object);
    }

    private async loadJSON<T>(path: string): Promise<T> {
        const response = await fetch(path);
        return response.json();
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawText(text: string, x: number, y: number, font: string = '16px Arial', color: string = 'black') {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawImage(spriteUrl: string, tileX: number, tileY: number, tileWidth: number, tileHeight: number, x: number, y: number, width: number, height: number ): void {
        const img = new Image();
        img.src = spriteUrl;
        img.onload = () => {
            this.ctx.drawImage(
                img,
                tileX,
                tileY,
                tileWidth,
                tileHeight,
                x * width,
                y * height,
                width,
                height
            );
        };
    }
    
    drawTerrain(): void {
        for (const layer of this.terrain.layers) {
            console.log(layer);
            if (layer.type === 'tilelayer') {
                for (let y = 0; y < layer.height; y++) {
                    for (let x = 0; x < layer.width; x++) {
                        const tileIndex = layer.data[y * layer.width + x];
                        console.log(tileIndex)
                        if (tileIndex >= 0) {
                            const tileX = (tileIndex % this.tileset.columns) * this.tileset.tilewidth;
                            const tileY = Math.floor(tileIndex / this.tileset.columns) * this.tileset.tileheight;
                            this.drawImage(PATH_IMG+this.tileset.image, tileX, tileY, this.tileset.tilewidth, this.tileset.tileheight, x, y, this.terrain.tilewidth, this.terrain.tileheight);
                        }
                    }
                }
            }else if (layer.type === 'objectgroup') {

            }
        }

    }

    draw(): void {
        this.clear();
        console.log('Drawing terrain');
        this.drawTerrain();
        // for (const obj of this.objects) {
        //     this.drawImage(obj.sprite, obj.x, obj.y, obj.width, obj.height);
        // }
        // setTimeout(() => this.draw(), 1000 / 60); // 60 FPS
    }
}