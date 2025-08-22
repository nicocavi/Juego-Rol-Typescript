import { Component } from '@angular/core';
import { Render } from './model/render';
import { Player } from './model/player';
import { MapJSON } from './model/types';
import { Map } from './model/map';
import { Input } from './model/input';

const PLAYER_TILESET = 'tileset_player.json';
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
  private last = performance.now();

  async ngOnInit() {
    const canvas = document.querySelector('#game') as HTMLCanvasElement;
    const input = new Input();
    this.player = new Player(
      {
        accel: 2400,         // sensibilidad
        maxSpeed: 50,       // velocidad máx.
        friction: 0.001,      // 0.02 muy “resbaloso”, 0.10 más frenado (topdown y fricción horiz. en platformer)
        gravity: 2200,       // usado solo en platformer
        jumpSpeed: 700       // usado solo en platformer
      },
      input,
      'Cavi', 100, 100, 50, 50, 16, 16, PLAYER_TILESET);
    await this.loadMap();
    this.render = new Render(canvas, this.map);
    await this.render.addEntity(this.player);
    await this.render.loadTilesets();

    this.render.draw();

    setInterval(() => this.loop() , 1000 / 30); // 30 FPS
  }

  loop() {
    const t = performance.now();
    const dt = Math.min((t - this.last) / 1000, 0.033); // clamp dt por seguridad
    this.last = t;
    this.player.update(dt);
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
