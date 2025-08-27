export interface Layer {
  data: number[];
  height: number;
  width: number;
  name: string;
  type: string;
  objects: any;
}

export interface MapJSON {
  height: number;
  width: number;
  tileheight: number;
  tilewidth: number;
  layers: Layer[];
  tilesets: { firstgid: number; source: string }[];
}

export interface TileSet {
  firstgid: number;
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  tiles?: {
    id: number;
    objectgroup: {
      draworder: string;
      objects: { id: number; x: number; y: number; width: number; height: number }[];
      id: number;
      opacity: number;
      type: string;
      visible: boolean;
      x: number;
      y: number;
    };
  }[];
}