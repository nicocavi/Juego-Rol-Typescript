import { GameObject, GameObjectType } from './gameObject';
import { loadJSON } from './loadJSON';
import { TerrainObject } from './terrainObject';
import { MapJSON, TileSet } from './types';

const PATH_IMG = 'assets/img/';
const PATH_TILESETS = 'assets/tilesets/';

export class Map {
  tilesets: TileSet[] = [];

  async load(mapData: MapJSON): Promise<{terrain: TerrainObject[][], objects: GameObject[]}> {
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

  private async loadTerrain(mapData: MapJSON): Promise<TerrainObject[][]> {
    const terrain: TerrainObject[][] = [];
    const layers = mapData.layers.filter(
      (l) => l.type === 'tilelayer'
    );
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const terrainRow: TerrainObject[] = [];
      for (let row = 0; row < layer.height; row++) {
        for (let col = 0; col < layer.width; col++) {
          const id = layer.data[row * layer.width + col];
          const tileset = this.findTileset(id);
          const cols = tileset.columns;
          const tileX = ((id - tileset.firstgid) % cols) * tileset.tilewidth;
          const tileY = Math.floor((id - tileset.firstgid) / cols) * tileset.tileheight;

          terrainRow.push({
            gid: id,
            x: col * mapData.tilewidth,
            y: row * mapData.tileheight,
            width: tileset.tilewidth,
            height: tileset.tileheight,
            dWidth: mapData.tilewidth,
            dHeight: mapData.tileheight,
            tileX,
            tileY,
          });
        }
      }
      terrain.push(terrainRow);
    }

    return terrain;
  }

  private async loadObjects(mapData: MapJSON): Promise<GameObject[]> {
    const objects: GameObject[] = [];
    const layer = mapData.layers.find(
      (l) => l.type === 'objectgroup'
    );
    if (layer && layer.objects) {
      layer.objects.forEach(({ gid, x, y, width, height }: GameObject) => {
      const tileset = this.findTileset(gid);
      const collider = tileset.tiles?.find( (t:any) => t.id === (gid - tileset.firstgid))?.objectgroup?.objects?.[0];
      const colliderData = collider ? { origin: { x: collider.x, y: collider.y }, width: collider.width, height: collider.height } : undefined;
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
            colliderData
          )
        );
      });
    }
    return objects;
  }
}
