import { Vec2 } from "./vec2";

export class Input {
    private keys = new Set<string>();
    constructor() {
      addEventListener("keydown", (e) => this.keys.add(e.key.toLowerCase()));
      addEventListener("keyup",   (e) => this.keys.delete(e.key.toLowerCase()));
    }
    get axisTopDown(): Vec2 {
      const x = (this.down("arrowright","d") ? 1 : 0) - (this.down("arrowleft","a") ? 1 : 0);
      const y = (this.down("arrowdown","s") ? 1 : 0) - (this.down("arrowup","w") ? 1 : 0);
      return new Vec2(x, y);
    }
    get jumpPressed(): boolean { return this.down(" ", "space", "w", "arrowup"); }
    private down(...k: string[]) { return k.some(key => this.keys.has(key)); }
}