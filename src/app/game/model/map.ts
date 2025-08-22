import { GameObject, GameObjectType } from './gameObject';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  tilesets: TileSet[] = [];

  async load(mapData: MapJSON): Promise<{terrain: TerrainObject[], objects: GameObject[]}> {
    this.tilesets = await Promise.all(
      mapData.tilesets.map(async (t) => {
        const tileset = await loadJSON<TileSet>(`${PATH_TILESETS}${t.source}`);
        return {
          ...tileset,
          firstgid: t.firstgid,
        };
      })
    );
    const terrain = await this.loadTerrain(mapData);
    const objects = await this.loadObjects(mapData);

    return {terrain, objects};
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

  private async loadTerrain(mapData: MapJSON): Promise<TerrainObject[]> {
    const terrain: TerrainObject[] = [];
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

          terrain.push({
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
    return terrain;
  }

  private async loadObjects(mapData: MapJSON): Promise<GameObject[]> {
    const objects: GameObject[] = [];
    const layer = mapData.layers.find(
      (l) => l.name === 'Objects' && l.type === 'objectgroup'
    );
    if (layer && layer.objects) {
      layer.objects.forEach(({ gid, x, y, width, height, collidable }: GameObject) => {
      const tileset = this.findTileset(gid);
      objects.push(
        new GameObject(
            gid,
            x,
            y,
            width,
            height,
            ((gid - tileset.firstgid) % tileset.columns) * tileset.tilewidth,
            Math.floor((gid - tileset.firstgid) / tileset.columns) * tileset.tileheight,
            mapData.tilewidth,
            mapData.tileheight,
            GameObjectType.OBSTACLE,
            true
          )
        );
      });
    }
    return objects;
  }
}
