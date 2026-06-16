import { Projectile } from './Projectile';
import {
  PLAYER_SPEED,
  PLAYER_SIZE,
  PLAYER_MAX_HEALTH,
  PLAYER_INVINCIBILITY_TIME,
  PLAYER_BULLET_SPEED,
  PLAYER_BULLET_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT,
  COLOR_PLAYER,
  COLOR_PLAYER_BULLET,
} from '../constants';
import { InputState } from '../managers/InputManager';

export class Player {
  x: number;
  y: number;
  width: number = PLAYER_SIZE;
  height: number = PLAYER_SIZE;
  radius: number = PLAYER_SIZE / 2;
  
  health: number = PLAYER_MAX_HEALTH;
  maxHealth: number = PLAYER_MAX_HEALTH;
  invincibilityFrames: number = 0;
  
  velocityX: number = 0;
  velocityY: number = 0;
  
  lastShotFrame: number = 0;
  shootCooldown: number = 6; // frames between shots (10 bullets/sec at 60 FPS)

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(input: InputState) {
    // Handle movement
    this.velocityX = 0;
    this.velocityY = 0;

    if (input.up) this.velocityY = -PLAYER_SPEED;
    if (input.down) this.velocityY = PLAYER_SPEED;
    if (input.left) this.velocityX = -PLAYER_SPEED;
    if (input.right) this.velocityX = PLAYER_SPEED;

    // Diagonal movement normalization
    if (this.velocityX !== 0 && this.velocityY !== 0) {
      const magnitude = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
      this.velocityX = (this.velocityX / magnitude) * PLAYER_SPEED;
      this.velocityY = (this.velocityY / magnitude) * PLAYER_SPEED;
    }

    // Update position (60 FPS = 1/60 second per frame)
    this.x += this.velocityX / 60;
    this.y += this.velocityY / 60;

    // Clamp to screen bounds
    this.x = Math.max(this.radius, Math.min(GAME_WIDTH - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(GAME_HEIGHT - this.radius, this.y));

    // Update invincibility
    if (this.invincibilityFrames > 0) {
      this.invincibilityFrames--;
    }

    this.lastShotFrame++;
  }

  shoot(): Projectile[] {
    const bullets: Projectile[] = [];

    if (this.lastShotFrame >= this.shootCooldown) {
      // Main bullet
      bullets.push(new Projectile(this.x, this.y - this.radius, 0, -PLAYER_BULLET_SPEED, PLAYER_BULLET_SIZE, true));
      
      // Side bullets
      bullets.push(new Projectile(this.x - 10, this.y - this.radius, -50, -PLAYER_BULLET_SPEED, PLAYER_BULLET_SIZE, true));
      bullets.push(new Projectile(this.x + 10, this.y - this.radius, 50, -PLAYER_BULLET_SPEED, PLAYER_BULLET_SIZE, true));

      this.lastShotFrame = 0;
    }

    return bullets;
  }

  takeDamage(amount: number) {
    if (this.isInvincible()) return;

    this.health -= amount;
    this.invincibilityFrames = PLAYER_INVINCIBILITY_TIME;
  }

  isInvincible(): boolean {
    return this.invincibilityFrames > 0;
  }

  respawn() {
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT - 100;
    this.health = this.maxHealth;
    this.invincibilityFrames = PLAYER_INVINCIBILITY_TIME;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Flash when invincible
    if (this.isInvincible() && Math.floor(this.invincibilityFrames / 5) % 2 === 0) {
      return;
    }

    ctx.save();

    // Draw player ship
    ctx.fillStyle = COLOR_PLAYER;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.lineTo(this.x - this.radius, this.y + this.radius);
    ctx.lineTo(this.x + this.radius, this.y + this.radius);
    ctx.closePath();
    ctx.fill();

    // Draw glow effect
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
