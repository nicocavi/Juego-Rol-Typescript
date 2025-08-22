export class Vec2 {
  constructor(public x = 0, public y = 0) {}
  add(v: Vec2) { this.x += v.x; this.y += v.y; return this; }
  scale(s: number) { this.x *= s; this.y *= s; return this; }
  length() { return Math.hypot(this.x, this.y); }
  normalize() {
    const l = this.length();
    if (l > 0) { this.x /= l; this.y /= l; }
    return this;
  }
  set(x: number, y: number) { this.x = x; this.y = y; return this; }
  clone() { return new Vec2(this.x, this.y); }
}