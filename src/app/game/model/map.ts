import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  private terrain: TerrainObject[] = [];
  tilesetTerrain: HTMLImageElement | null = null;

  async load(mapData: MapJSON) {
    await this.processMap(mapData);
  }

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  private async processMap(mapData: MapJSON): Promise<void> {
    const layer = mapData.layers.find(
      (l) => l.name === 'Ground' && l.type === 'tilelayer'
    );
    if (layer && layer.data) {
      const tileset = await loadJSON<TileSet>(
        PATH_TILESETS + mapData.tilesets[0].source
      );

      this.tilesetTerrain = await this.loadImage(`${PATH_IMG}${tileset.image}`);

      for (let row = 0; row < layer.height; row++) {
        for (let col = 0; col < layer.width; col++) {
            const id = layer.data[row * layer.width + col];
            const cols = tileset.columns;
            const tileX = (id % cols) * tileset.tilewidth;
            const tileY = Math.floor(id / cols) * tileset.tileheight;

            this.terrain.push({
              x: col,
              y: row,
              width: tileset.tilewidth,
              height: tileset.tileheight,
              dWidth: mapData.tilewidth,
              dHeight: mapData.tileheight,
              tileX,
              tileY,
            });
        }
      }
    }
  }

  get terrainObjects(): TerrainObject[] {
    return this.terrain;
  }
}
