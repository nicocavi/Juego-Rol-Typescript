export interface MovementConfig {
    accel: number;       // px/s^2
    maxSpeed: number;    // px/s
    friction: number;    // 0..1 (solo topdown: 1 = sin fricción)
    gravity?: number;    // px/s^2 (platformer)
    jumpSpeed?: number;  // px/s (platformer)
  }