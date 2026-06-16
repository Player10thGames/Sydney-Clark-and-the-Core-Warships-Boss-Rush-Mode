import { Projectile } from './Projectile';
import { GAME_WIDTH, GAME_HEIGHT, BOSS_SIZE } from '../constants';

export abstract class Boss {
  x: number = GAME_WIDTH / 2;
  y: number = 100;
  width: number = BOSS_SIZE;
  height: number = BOSS_SIZE;
  radius: number = BOSS_SIZE / 2;

  health: number;
  maxHealth: number;

  patternIndex: number = 0;
  patternTimer: number = 0;
  patternDuration: number = 120; // 2 seconds at 60 FPS

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
  }

  update(frameCount: number) {
    this.patternTimer++;

    if (this.patternTimer >= this.patternDuration) {
      this.patternIndex = (this.patternIndex + 1) % this.getPatternCount();
      this.patternTimer = 0;
    }
  }

  abstract getPatternCount(): number;
  abstract shoot(frameCount: number): Projectile[];

  takeDamage(amount: number) {
    this.health -= amount;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(this.x - this.radius, this.y - this.radius, this.width, this.height);
    ctx.restore();
  }
}
