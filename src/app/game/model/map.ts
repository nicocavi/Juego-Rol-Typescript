import { GameObject } from './gameObject';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  private terrain: TerrainObject[] = [];
  private objects: GameObject[] = [];
  tilesets: { id: number; source: string }[] = [];

  async load(mapData: MapJSON) {
    this.tilesets = mapData.tilesets.map(({ firstgid, source }) => ({
      id: firstgid,
      source,
    }));
    await this.processMap(mapData);
  }

  private async loadTerrain(mapData: MapJSON): Promise<void> {
    const layer = mapData.layers.find(
      (l) => l.name === 'Ground' && l.type === 'tilelayer'
    );
    if (layer && layer.data) {
      const tileset = await loadJSON<TileSet>(
        PATH_TILESETS + mapData.tilesets[0].source
      );

      for (let row = 0; row < layer.height; row++) {
        for (let col = 0; col < layer.width; col++) {
          const id = layer.data[row * layer.width + col];
          const cols = tileset.columns;
          const tileX = (id % cols) * tileset.tilewidth;
          const tileY = Math.floor(id / cols) * tileset.tileheight;

          this.terrain.push({
            gid: id,
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

  private async loadObjects(mapData: MapJSON): Promise<void> {
    const layer = mapData.layers.find(
      (l) => l.name === 'Objects' && l.type === 'objectgroup'
    );
    if (layer && layer.objects) {
      const tileset = await loadJSON<TileSet>(
        PATH_TILESETS + mapData.tilesets[0].source
      );
      layer.objects.forEach(({ gid, x, y, width, height }: GameObject) => {
        this.objects.push({
          gid,
          x,
          y,
          width,
          height,
        });
      });
    }
  }

  private async processMap(mapData: MapJSON): Promise<void> {
    await this.loadTerrain(mapData);
    await this.loadObjects(mapData);
  }

  get terrainObjects(): GameObject[] {
    return this.objects;
  }

  get terrainElement(): TerrainObject[] {
    return this.terrain;
  }
}
