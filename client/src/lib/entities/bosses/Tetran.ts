import { Boss } from '../Boss';
import { Projectile } from '../Projectile';
import { TETRAN_MAX_HEALTH, GAME_WIDTH, GAME_HEIGHT, BOSS_BULLET_SPEED } from '../../constants';

export class Tetran extends Boss {
  constructor() {
    super(TETRAN_MAX_HEALTH);
  }

  getPatternCount(): number {
    return 3;
  }

  shoot(frameCount: number): Projectile[] {
    const bullets: Projectile[] = [];

    // Pattern 0: Spiral attack
    if (this.patternIndex === 0) {
      if (frameCount % 8 === 0) {
        const spiralAngle = (frameCount / 8) * (Math.PI / 4);
        for (let i = 0; i < 8; i++) {
          const angle = spiralAngle + (i * Math.PI * 2) / 8;
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }
    }

    // Pattern 1: Convergence (bullets converge toward player)
    if (this.patternIndex === 1) {
      if (frameCount % 10 === 0) {
        const playerX = GAME_WIDTH / 2;
        const playerY = GAME_HEIGHT - 100;
        
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const startX = this.x + Math.cos(angle) * 50;
          const startY = this.y + Math.sin(angle) * 50;
          
          const dx = playerX - startX;
          const dy = playerY - startY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const vx = (dx / distance) * BOSS_BULLET_SPEED;
          const vy = (dy / distance) * BOSS_BULLET_SPEED;
          
          bullets.push(new Projectile(startX, startY, vx, vy, 6, false));
        }
      }
    }

    // Pattern 2: Rapid pulse
    if (this.patternIndex === 2) {
      if (frameCount % 6 === 0) {
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
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

    // Draw central crystal
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.lineTo(this.x + this.radius, this.y + this.radius / 2);
    ctx.lineTo(this.x, this.y + this.radius);
    ctx.lineTo(this.x - this.radius, this.y + this.radius / 2);
    ctx.closePath();
    ctx.fill();

    // Draw surrounding crystals
    ctx.fillStyle = '#00dddd';
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 + (this.patternTimer / 30);
      const x = this.x + Math.cos(angle) * (this.radius * 1.5);
      const y = this.y + Math.sin(angle) * (this.radius * 1.5);
      
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + 8, y + 8);
      ctx.lineTo(x, y + 4);
      ctx.lineTo(x - 8, y + 8);
      ctx.closePath();
      ctx.fill();
    }

    // Draw glow
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
