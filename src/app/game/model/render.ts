import { GameObject } from './gameObject';
import { loadJSON } from './loadJSON';
import { Map } from './map';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

interface TileData {
  id: number;
  tile: HTMLImageElement;
  colums: number;
  tileWidth: number;
  tileHeight: number;
}

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  objects: GameObject[] = [];
  tilesets: TileData[] = [];
  map: Map;

  constructor(canvas: HTMLCanvasElement, map: Map) {
    this.map = map;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  async loadTilesets(): Promise<void> {
    this.tilesets = await Promise.all(
      this.map.tilesets.map(
        async ({ firstgid, image, columns, tileheight, tilewidth }) => {
          const img = await this.loadImage(`${PATH_IMG}${image}`);
          return {
            id: firstgid,
            tile: img,
            colums: columns || 1,
            tileWidth: tilewidth,
            tileHeight: tileheight,
          };
        }
      )
    );
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  addObject(object: GameObject): void {
    this.objects.push(object);
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      x,
      y,
      width,
      height
    );
  }

  private findTileset(gid: number): TileData {
    let tileset = this.tilesets[0];
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
      if (gid >= this.tilesets[i].id) {
        tileset = this.tilesets[i];
        break;
      }
    }
    return tileset;
  }

  drawTerrain(): void {
    for (const {
      gid,
      tileX,
      tileY,
      x,
      y,
      width,
      height,
      dHeight,
      dWidth,
    } of this.map.terrainElement) {
      const { tile } = this.findTileset(gid);
      this.drawImage(
        tile,
        tileX,
        tileY,
        width,
        height,
        x * dWidth,
        y * dHeight,
        dWidth,
        dHeight
      );
    }
  }

  drawObjects(): void {
    const objects = this.map.terrainObjects.sort((a, b) => a.y - b.y);
    for (const object of objects) {
      const { gid, x, y, width, height, sx, sy } = object;
      const { tile } = this.findTileset(gid);
      this.drawImage(tile, sx, sy, width, height, x, y, width, height);
    }
  }

  draw(): void {
    this.clear();
    console.log('Drawing terrain');
    this.drawTerrain();
    this.drawObjects();
    // setTimeout(() => this.draw(), 1000 / 60); // 60 FPS
  }
}
