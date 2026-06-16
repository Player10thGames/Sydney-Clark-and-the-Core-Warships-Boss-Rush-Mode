import { GAME_WIDTH, GAME_HEIGHT, COLOR_PLAYER_BULLET, COLOR_BOSS_BULLET } from '../constants';

export class Projectile {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  isPlayerBullet: boolean;
  active: boolean = true;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    radius: number,
    isPlayerBullet: boolean
  ) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.radius = radius;
    this.isPlayerBullet = isPlayerBullet;
  }

  update() {
    this.x += this.velocityX / 60; // 60 FPS
    this.y += this.velocityY / 60;

    // Deactivate if out of bounds
    if (
      this.x < -50 ||
      this.x > GAME_WIDTH + 50 ||
      this.y < -50 ||
      this.y > GAME_HEIGHT + 50
    ) {
      this.active = false;
    }
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.isPlayerBullet) {
      ctx.fillStyle = COLOR_PLAYER_BULLET;
      ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
      ctx.shadowBlur = 10;
    } else {
      ctx.fillStyle = COLOR_BOSS_BULLET;
      ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
