import { Entities } from './entities';
import { GameObject } from './gameObject';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { TileSet } from './types';
import { Camera } from './camera';
import { Player } from './player';

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
  tilesets: TileData[] = [];
  scale = 3;
  camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.camera = new Camera(22, 20, 16);
  }

  async loadTilesets(tilesets: TileSet[]): Promise<void> {
    this.tilesets = [
      ...(await Promise.all(
        tilesets.map(
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
      )),
      ...this.tilesets,
    ].sort((a, b) => a.id - b.id);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  async addEntity(object: GameObject): Promise<void> {
    const tileset = await loadJSON<TileSet>(
      `${PATH_TILESETS}${object.tileset || 'default.json'}`
    );

    const image = await this.loadImage(`${PATH_IMG}${tileset.image}`);

    this.tilesets.push({
      id: object.gid,
      tile: image,
      colums: tileset.columns || 1,
      tileWidth: tileset.tilewidth,
      tileHeight: tileset.tileheight,
    });

    this.tilesets = this.tilesets.sort((a, b) => a.id - b.id);
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
      x * this.scale,
      y * this.scale,
      width * this.scale,
      height * this.scale
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

  drawTerrain(terrains: TerrainObject[][]): void {
    terrains.map( layer => {

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
      } of layer) {
        const { tile } = this.findTileset(gid);
        this.drawImage(
          tile,
          tileX,
          tileY,
          width,
          height,
          x - this.camera.x,
          y - this.camera.y,
          dWidth,
          dHeight
        );
      }

    });
  }

  drawObjects(entities: GameObject[], overlap = false): void {
    const objects = overlap ? entities.sort((a, b) => a.y + a.height - (b.y + b.height)) : entities;

    for (const object of objects) {
      const { gid, x, y, width, height, sx, sy } = object;
      const { tile } = this.findTileset(gid);
      const screen = this.camera.worldToScreen(x, y);
      this.drawImage(
        tile,
        sx,
        sy,
        width,
        height,
        screen.x,
        screen.y - 16,
        width,
        height
      );
    }
  }

  draw(elements: Entities, player: Player, dt: number): void {
    this.clear();
    this.camera.follow(player, dt);
    const terrain = this.visibleTerrain(elements.terrain);
    const objectsOverlapOff = elements.objects[0].filter(
      ({ x, y, height, width }) => this.camera.viewInCamera(x, y, width, height));
    const objectsOverlap = [...elements.objects[1], ...elements.entities].filter(
      ({ x, y, height, width }) => this.camera.viewInCamera(x, y, width, height));
    const highGround: TerrainObject[] = terrain.pop() || [];
    this.drawTerrain(terrain);
    this.drawObjects(objectsOverlapOff, false);
    this.drawObjects(objectsOverlap, true);
    this.drawTerrain([highGround]);
    // this.drawCells();
    // this.drawColliders(objects);
    // this.drawTileNumber(objects);
  }

  private visibleTerrain(terrains: TerrainObject[][]): TerrainObject[][] {

    return terrains.map(terrain => terrain.filter(({ x, y, height, width }) =>
      this.camera.viewInCamera(x, y, width, height)
    ));

  }

  private drawCells(): void {
    const { tileSize, viewportWidth, viewportHeight, x: camX, y: camY } = this.camera;
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    for (let col = 0; col <= viewportWidth; col++) {
      for (let row = 0; row <= viewportHeight; row++) {
        const x = col * tileSize;
        const y = row * tileSize;
        this.ctx.strokeRect(x * this.scale, y * this.scale, tileSize * this.scale, tileSize * this.scale);
      }
    }
  }

  private drawColliders(objects: GameObject[]): void {
    this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    for (const { x, y, collider } of objects) {
      if(collider){
        const screen = this.camera.worldToScreen(x + collider.origin.x, y + collider.origin.y);
        this.ctx.fillRect(screen.x * this.scale, (screen.y - 16) * this.scale, collider.width * this.scale, collider.height * this.scale);
      }
    }
  }

  private drawTileNumber(objects: GameObject[]): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.font = `${6 * this.scale}px Arial`;
    this.ctx.textAlign = 'center';
    for (const { x, y, width, height, gid } of objects) {
      const screen = this.camera.worldToScreen(x + width / 2, y + height / 2);
      this.ctx.fillText(gid.toString(), screen.x * this.scale, (screen.y - 16) * this.scale);
    }
  }
}
