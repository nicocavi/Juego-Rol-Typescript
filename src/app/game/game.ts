import { Component } from '@angular/core';
import { Render } from './model/render';
import { Player } from './model/player';
import { MapJSON } from './model/types';

const PLAYER_TILESET = 'assets/img/player/SpriteSheet.png';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {

  private render!:Render;
  private player!:Player;
  private map!: MapJSON;
  private lvl = 1;

  async ngOnInit() {
    const canvas = document.querySelector('#game') as HTMLCanvasElement;
    this.player = new Player('Cavi', 100, 100, 50, 50, 32, 32, PLAYER_TILESET);
    await this.loadMap();
    this.render = new Render(canvas, this.map);
    await this.render.load();
    this.render.addObject(this.player);
    this.render.draw();
  }

  async loadMap(): Promise<void> {
    this.map = await this.loadJSON<MapJSON>("/assets/maps/map_"+this.lvl+".json");
  }

  private async loadJSON<T>(path: string): Promise<T> {
    const response = await fetch(path);
    return response.json();
  }

}
