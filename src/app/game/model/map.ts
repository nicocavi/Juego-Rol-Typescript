import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  private mapData: MapJSON;
  private tilesetData: TileSet;
  private tilesetImage: HTMLImageElement;
  
  constructor(mapData: MapJSON, tilesetData: TileSet) {
    this.mapData = mapData;
    this.tilesetData = tilesetData;

    this.tilesetImage = new Image();
    this.tilesetImage.src = PATH_TILESETS+tilesetData.image; // ruta relativa
  }
    

  render(ctx: CanvasRenderingContext2D) {
    if (!this.tilesetImage.complete) return; // esperar a que cargue la imagen

    // --- 1. Renderizar capa Ground ---
    const ground = this.mapData.layers.find((l) => l.name === 'Ground');
    if (ground && ground.type === 'tilelayer' && ground.data) {
      for (let row = 0; row < ground.height!; row++) {
        for (let col = 0; col < ground.width!; col++) {
          const idx = row * ground.width! + col;
          const gid = ground.data[idx];
        }
      }
    }

    // --- 2. Renderizar objetos ---
    const objects = this.mapData.layers.find((l) => l.name === 'Objects');
    if (objects && objects.type === 'objectgroup' && objects.objects) {
      for (const obj of objects.objects) {
        const gid = obj.gid;
        if (!gid) continue;

        const firstgid = this.mapData.tilesets[0].firstgid;
        const localId = gid - firstgid;

        const cols = this.tilesetData.columns;
        const sx = (localId % cols) * this.tilesetData.tilewidth;
        const sy = Math.floor(localId / cols) * this.tilesetData.tileheight;

        ctx.drawImage(
          this.tilesetImage,
          sx,
          sy,
          obj.width / 4, // porque tu objeto es 48px pero el tile original es 16px
          obj.height / 4,
          obj.x,
          obj.y - obj.height, // ajustar ancla Y
          obj.width,
          obj.height
        );
      }
    }
  }
}
