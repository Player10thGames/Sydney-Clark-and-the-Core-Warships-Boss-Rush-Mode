import { Boss } from '../Boss';
import { Projectile } from '../Projectile';
import { BIG_CORE_MAX_HEALTH, GAME_WIDTH, BOSS_BULLET_SPEED } from '../../constants';

export class BigCore extends Boss {
  constructor() {
    super(BIG_CORE_MAX_HEALTH);
  }

  getPatternCount(): number {
    return 3;
  }

  shoot(frameCount: number): Projectile[] {
    const bullets: Projectile[] = [];

    // Pattern 0: Laser sweep (horizontal)
    if (this.patternIndex === 0) {
      const sweepAngle = (this.patternTimer / this.patternDuration) * Math.PI;
      const direction = this.patternTimer < this.patternDuration / 2 ? 1 : -1;
      
      if (frameCount % 10 === 0) {
        for (let i = 0; i < 5; i++) {
          const angle = sweepAngle + (i - 2) * 0.2;
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED * direction;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }
    }

    // Pattern 1: Bullet spray
    if (this.patternIndex === 1) {
      if (frameCount % 15 === 0) {
        const baseAngle = (frameCount / 15) * (Math.PI / 2.5);
        for (let i = 0; i < 5; i++) {
          const angle = baseAngle + (i - 2) * (Math.PI / 10);
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }
    }

    // Pattern 2: Diagonal barrage
    if (this.patternIndex === 2) {
      if (frameCount % 12 === 0) {
        const angles = [
          Math.PI / 4,
          (3 * Math.PI) / 4,
          (5 * Math.PI) / 4,
          (7 * Math.PI) / 4,
        ];
        for (const angle of angles) {
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }
    }

    return bullets;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Draw main core
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw rotating segments
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const angle = (this.patternTimer / 30 + i * Math.PI / 2);
      const x1 = this.x + Math.cos(angle) * this.radius;
      const y1 = this.y + Math.sin(angle) * this.radius;
      const x2 = this.x + Math.cos(angle + Math.PI / 4) * (this.radius * 1.3);
      const y2 = this.y + Math.sin(angle + Math.PI / 4) * (this.radius * 1.3);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw glow
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
