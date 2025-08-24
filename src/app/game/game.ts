import { Component } from '@angular/core';
import { Entities } from './model/entities';
import { Input } from './model/input';
import { Map } from './model/map';
import { PhysicsManager } from './model/physicsManager';
import { Player } from './model/player';
import { Render } from './model/render';
import { MapJSON } from './model/types';
import { Entity } from './model/entity';

const PLAYER_TILESET = 'tileset_player.json';
@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  private render!: Render;
  private player!: Player;
  private map: Map = new Map();
  private physicsManager = new PhysicsManager();
  private lvl = 1;
  private last = performance.now();
  private elements: Entities = { terrain: [], objects: [], entities: [] };

  async ngOnInit() {
    await this.load();
    setInterval(() => this.loop(), 1000 / 30); // 30 FPS
  }

  loop() {
    const t = performance.now();
    const dt = Math.min((t - this.last) / 1000, 0.033); // clamp dt por seguridad
    this.last = t;
    this.updateAllEntities(dt);
    this.render.draw(this.elements, this.player, dt);
  }

  async load(): Promise<void> {
    const canvas = document.querySelector('#game') as HTMLCanvasElement;
    const input = new Input();
    this.player = new Player(
      {
        accel: 3400, // sensibilidad
        maxSpeed: 100, // velocidad máx.
        friction: 0.001, // 0.02 muy “resbaloso”, 0.10 más frenado (topdown y fricción horiz. en platformer)
        gravity: 2200, // usado solo en platformer
        jumpSpeed: 700, // usado solo en platformer
      },
      input,
      'Cavi',
      100,
      100,
      30,
      50,
      16,
      16,
      PLAYER_TILESET
    );
    const terrain = await this.loadMap();
    this.elements = { ...this.elements, ...terrain };
    this.render = new Render(canvas);
    this.elements.entities.push(this.player);
    await this.render.addEntity(this.player);
    await this.render.loadTilesets(this.map.tilesets);
  }

  async loadMap(): Promise<Partial<Entities>> {
    const mapData = await this.loadJSON<MapJSON>(
      '/assets/maps/map_' + this.lvl + '.json'
    );
    return await this.map.load(mapData);
  }

  private async loadJSON<T>(path: string): Promise<T> {
    const response = await fetch(path);
    return response.json();
  }

  private updateAllEntities(delta: number): void {
    for (const e of this.elements.entities) {
      const oldX = e.x;
      const oldY = e.y;

      e.update(delta);

      const collisions = this.physicsManager.checkCollisions(
        e,
        [...this.elements.objects, ...this.elements.entities]
      );

      if (collisions.length > 0) {
        // 4. Resolver colisión: simple rollback
        e.x = oldX;
        e.y = oldY;
        e.vel.set(0, 0); // detener movimiento

        // Si quieres algo más fino: resolver por eje
        // entity.x = oldX; // solo si la colisión vino de X
        // entity.y = oldY; // solo si vino de Y
      }
    }
  }
}
