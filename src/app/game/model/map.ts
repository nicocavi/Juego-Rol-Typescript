import { map } from 'rxjs';
import { GameObject } from './gameObject';
import { MapJSON, TileSet } from './types';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  private terrain: TerrainObject[] = [];

  async load(mapData: MapJSON) {
    await this.processMap(mapData);
  }

  private async processMap(mapData: MapJSON): Promise<void> {
    const layer = mapData.layers.find(
      (l) => l.name === 'Ground' && l.type === 'tilelayer'
    );
    if (layer && layer.data) {
      const tileset = await loadJSON<TileSet>(
        PATH_TILESETS + mapData.tilesets[0].source
      );

      for (let row = 0; row < layer.height; row++) {
        for (let col = 0; col < layer.width; col++) {
          const idx = row * layer.width + col;
          const gid = layer.data[idx];
          if (gid > 0) {
            const firstgid = mapData.tilesets[0].firstgid;
            const localId = gid - firstgid;
            const cols = tileset.columns;
            const tileX = (localId % cols) * tileset.tilewidth;
            const tileY = Math.floor(localId / cols) * tileset.tileheight;
            const sprite = new Image();
            sprite.src = `${PATH_TILESETS}${tileset.image}`;
            this.terrain.push({
              x: col * mapData.tilewidth,
              y: row * mapData.tileheight,
              width: mapData.tilewidth,
              height: mapData.tileheight,
              sprite,
              tileX,
              tileY
            });
          }
        }
      }
    }
  }

}
