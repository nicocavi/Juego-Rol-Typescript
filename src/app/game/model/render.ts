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
      this.map.tilesets.map(async (tileset) => {
        const { image, columns, tileheight, tilewidth } =
          await loadJSON<TileSet>(`${PATH_TILESETS}${tileset.source}`);
        const img = await this.loadImage(`${PATH_IMG}${image}`);
        return {
          id: tileset.id,
          tile: img,
          colums: columns || 1,
          tileWidth: tilewidth,
          tileHeight: tileheight,
        };
      })
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
      x * width,
      y * height,
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
        x,
        y,
        dWidth,
        dHeight
      );
    }
  }

  drawObjects(): void {
    for (const { gid, x, y, width, height } of this.map.terrainObjects) {
        const {tile, tileHeight, tileWidth, colums} = this.findTileset(gid);
      this.drawImage(
        tile,
        width,
        height,
        width,
        height,
        x,
        y,
        width,
        height,
      );
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
