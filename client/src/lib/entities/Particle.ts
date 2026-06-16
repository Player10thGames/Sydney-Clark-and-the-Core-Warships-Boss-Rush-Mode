import {
  COLOR_PARTICLE_EXPLOSION,
  COLOR_PARTICLE_HIT,
  COLOR_PARTICLE_DAMAGE,
} from '../constants';

export type ParticleType = 'explosion' | 'hit' | 'damage';

export class Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  type: ParticleType;
  lifetime: number;
  maxLifetime: number;
  active: boolean = true;

  constructor(
    x: number,
    y: number,
    type: ParticleType,
    angle?: number
  ) {
    this.x = x;
    this.y = y;
    this.type = type;

    // Set lifetime based on type
    if (type === 'explosion') {
      this.maxLifetime = 60; // 1 second
      this.lifetime = 60;
    } else if (type === 'hit') {
      this.maxLifetime = 30; // 0.5 seconds
      this.lifetime = 30;
    } else {
      this.maxLifetime = 40; // 0.67 seconds
      this.lifetime = 40;
    }

    // Set velocity based on angle
    if (angle !== undefined) {
      const speed = type === 'explosion' ? 150 : 100;
      this.velocityX = Math.cos(angle) * speed;
      this.velocityY = Math.sin(angle) * speed;
    } else {
      this.velocityX = (Math.random() - 0.5) * 200;
      this.velocityY = (Math.random() - 0.5) * 200;
    }
  }

  update() {
    this.x += this.velocityX / 60; // 60 FPS
    this.y += this.velocityY / 60;

    this.lifetime--;

    if (this.lifetime <= 0) {
      this.active = false;
    }

    // Apply gravity/deceleration
    this.velocityX *= 0.98;
    this.velocityY *= 0.98;
  }

  isActive(): boolean {
    return this.active;
  }

  render(ctx: CanvasRenderingContext2D) {
    const progress = 1 - this.lifetime / this.maxLifetime;
    const opacity = 1 - progress;

    ctx.save();
    ctx.globalAlpha = opacity;

    let color = COLOR_PARTICLE_HIT;
    let size = 4;

    if (this.type === 'explosion') {
      color = COLOR_PARTICLE_EXPLOSION;
      size = 8 - progress * 6;
    } else if (this.type === 'hit') {
      color = COLOR_PARTICLE_HIT;
      size = 6 - progress * 4;
    } else if (this.type === 'damage') {
      color = COLOR_PARTICLE_DAMAGE;
      size = 5 - progress * 3;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(1, size), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
