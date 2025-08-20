import { GameObject } from './gameObject';
import { Map } from './map';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  objects: GameObject[] = [];
  map: Map;
  tileset!: TileSet;

  constructor(canvas: HTMLCanvasElement, map: Map) {
    this.map = map;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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

  private drawText(
    text: string,
    x: number,
    y: number,
    font: string = '16px Arial',
    color: string = 'black'
  ) {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  drawImage(
    sprite: HTMLImageElement,
    tileX: number,
    tileY: number,
    tileWidth: number,
    tileHeight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.ctx.drawImage(
        sprite,
        tileX,
        tileY,
        tileWidth,
        tileHeight,
        x * width,
        y * height,
        width,
        height
    );
  }

  drawTerrain(): void {
    for (const { tileX, tileY, x, y, width, height, dHeight, dWidth} of this.map
      .terrainObjects) {
      if (this.map.tilesetTerrain)
        this.drawImage(
          this.map.tilesetTerrain,
          tileX,
          tileY,
          width,
          height,
          x,
          y,
          dWidth,
          dHeight
        );
    }
  }

  draw(): void {
    this.clear();
    console.log('Drawing terrain');
    this.drawTerrain();
    // setTimeout(() => this.draw(), 1000 / 60); // 60 FPS
  }
}
