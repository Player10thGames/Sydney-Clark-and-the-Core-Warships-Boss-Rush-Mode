import { Boss } from '../Boss';
import { Projectile } from '../Projectile';
import { CRYSTAL_CORE_MAX_HEALTH, GAME_WIDTH, GAME_HEIGHT, BOSS_BULLET_SPEED } from '../../constants';

export class CrystalCore extends Boss {
  constructor() {
    super(CRYSTAL_CORE_MAX_HEALTH);
  }

  getPatternCount(): number {
    return 4;
  }

  shoot(frameCount: number): Projectile[] {
    const bullets: Projectile[] = [];

    // Pattern 0: Laser grid
    if (this.patternIndex === 0) {
      if (frameCount % 15 === 0) {
        const gridSize = 3;
        for (let i = 0; i < gridSize; i++) {
          const angle = (i * Math.PI) / gridSize;
          for (let j = 0; j < 5; j++) {
            const offset = (j - 2) * 30;
            const vx = Math.cos(angle) * BOSS_BULLET_SPEED + offset * 0.5;
            const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
            bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
          }
        }
      }
    }

    // Pattern 1: Bullet hell
    if (this.patternIndex === 1) {
      if (frameCount % 5 === 0) {
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12 + (frameCount / 30);
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }
    }

    // Pattern 2: Homing projectiles
    if (this.patternIndex === 2) {
      if (frameCount % 20 === 0) {
        const playerX = GAME_WIDTH / 2;
        const playerY = GAME_HEIGHT - 100;
        
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI * 2) / 4;
          const startX = this.x + Math.cos(angle) * 60;
          const startY = this.y + Math.sin(angle) * 60;
          
          const dx = playerX - startX;
          const dy = playerY - startY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const vx = (dx / distance) * (BOSS_BULLET_SPEED * 0.7);
          const vy = (dy / distance) * (BOSS_BULLET_SPEED * 0.7);
          
          bullets.push(new Projectile(startX, startY, vx, vy, 6, false));
        }
      }
    }

    // Pattern 3: Combined assault (mix of all patterns)
    if (this.patternIndex === 3) {
      if (frameCount % 8 === 0) {
        // Spiral
        const spiralAngle = (frameCount / 8) * (Math.PI / 6);
        for (let i = 0; i < 6; i++) {
          const angle = spiralAngle + (i * Math.PI * 2) / 6;
          const vx = Math.cos(angle) * BOSS_BULLET_SPEED;
          const vy = Math.sin(angle) * BOSS_BULLET_SPEED;
          bullets.push(new Projectile(this.x, this.y, vx, vy, 6, false));
        }
      }

      if (frameCount % 12 === 0) {
        // Convergence
        const playerX = GAME_WIDTH / 2;
        const playerY = GAME_HEIGHT - 100;
        
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
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

    return bullets;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Draw central crystal core
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.lineTo(this.x + this.radius, this.y);
    ctx.lineTo(this.x, this.y + this.radius);
    ctx.lineTo(this.x - this.radius, this.y);
    ctx.closePath();
    ctx.fill();

    // Draw rotating crystal shards
    ctx.fillStyle = '#ff00aa';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + (this.patternTimer / 20);
      const distance = this.radius * 1.4;
      const x = this.x + Math.cos(angle) * distance;
      const y = this.y + Math.sin(angle) * distance;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }

    // Draw energy glow
    const glowIntensity = 0.3 + Math.sin(this.patternTimer / 10) * 0.2;
    ctx.strokeStyle = `rgba(255, 0, 255, ${glowIntensity})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 15, 0, Math.PI * 2);
    ctx.stroke();

    // Draw inner glow
    ctx.strokeStyle = 'rgba(255, 0, 170, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
