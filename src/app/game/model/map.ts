import { GameObject } from './gameObject';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  private terrain: TerrainObject[] = [];
  private objects: GameObject[] = [];
  tilesets: TileSet[] = [];

  async load(mapData: MapJSON) {
    this.tilesets = await Promise.all(
      mapData.tilesets.map(async (t) => {
        const tileset = await loadJSON<TileSet>(`${PATH_TILESETS}${t.source}`);
        return {
          ...tileset,
          firstgid: t.firstgid,
        };
      })
    );
    await this.processMap(mapData);
  }

  private findTileset(gid: number): TileSet {
    let tileset = this.tilesets[0];
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
      if (gid >= this.tilesets[i].firstgid) {
        tileset = this.tilesets[i];
        break;
      }
    }
    return tileset;
  }

  private async loadTerrain(mapData: MapJSON): Promise<void> {
    const layer = mapData.layers.find(
      (l) => l.name === 'Ground' && l.type === 'tilelayer'
    );
    if (layer && layer.data) {
      for (let row = 0; row < layer.height; row++) {
        for (let col = 0; col < layer.width; col++) {
          const id = layer.data[row * layer.width + col];
          const tileset = this.findTileset(id);
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
      layer.objects.forEach(({ gid, x, y, width, height }: GameObject) => {
      const tileset = this.findTileset(gid);
      console.log(tileset)
      this.objects.push({
          gid,
          x,
          y,
          width,
          height,
          sx: ((gid - tileset.firstgid) % tileset.columns) * tileset.tilewidth,
          sy: Math.floor((gid - tileset.firstgid) / tileset.columns) * tileset.tileheight,
          dWidth: mapData.tilewidth,
          dHeight: mapData.tileheight,
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
