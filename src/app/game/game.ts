import { Component } from '@angular/core';
import { Render } from './model/render';
import { Player } from './model/player';
import { MapJSON } from './model/types';
import { Map } from './model/map';

const PLAYER_TILESET = 'tileset_player.json';
const keys = new Set<string>();
@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {

  private render!:Render;
  private player!:Player;
  private map: Map = new Map();
  private lvl = 1;

  async ngOnInit() {
    const canvas = document.querySelector('#game') as HTMLCanvasElement;
    this.player = new Player('Cavi', 100, 100, 50, 50, 16, 16, PLAYER_TILESET);
    await this.loadMap();
    this.render = new Render(canvas, this.map);
    await this.render.addEntity(this.player);
    await this.render.loadTilesets();



    window.addEventListener("keydown", e => keys.add(e.key));
    window.addEventListener("keyup", e => keys.delete(e.key));



    this.render.draw();

    setInterval(() => this.loop(), (1000 / 30));

  }

  loop() {
    this.player.update(keys);
    this.render.draw();
  }

  async loadMap(): Promise<void> {
    const mapData = await this.loadJSON<MapJSON>("/assets/maps/map_"+this.lvl+".json");
    await this.map.load(mapData);
  }

  private async loadJSON<T>(path: string): Promise<T> {
    const response = await fetch(path);
    return response.json();
  }

}
