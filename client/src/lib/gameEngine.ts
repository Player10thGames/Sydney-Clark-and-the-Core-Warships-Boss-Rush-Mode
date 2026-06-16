import { Player } from './entities/Player';
import { BigCore } from './entities/bosses/BigCore';
import { Tetran } from './entities/bosses/Tetran';
import { CrystalCore } from './entities/bosses/CrystalCore';
import { Projectile } from './entities/Projectile';
import { Particle } from './entities/Particle';
import { InputManager } from './managers/InputManager';
import { CollisionManager } from './managers/CollisionManager';
import { AudioManager } from './managers/AudioManager';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

export type GameState = 'menu' | 'intro' | 'boss1' | 'boss2' | 'boss3' | 'victory' | 'gameover' | 'pause';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  currentState: GameState = 'menu';
  
  // Game entities
  player: Player | null = null;
  currentBoss: BigCore | Tetran | CrystalCore | null = null;
  playerProjectiles: Projectile[] = [];
  bossProjectiles: Projectile[] = [];
  particles: Particle[] = [];
  
  // Game state
  score: number = 0;
  lives: number = 3;
  bossHealth: number = 100;
  currentBossIndex: number = 0;
  bosses: (typeof BigCore | typeof Tetran | typeof CrystalCore)[] = [BigCore, Tetran, CrystalCore];
  
  // Managers
  inputManager: InputManager;
  collisionManager: CollisionManager;
  audioManager: AudioManager;
  
  // Timing
  frameCount: number = 0;
  introTimer: number = 0;
  
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.inputManager = new InputManager();
    this.collisionManager = new CollisionManager();
    this.audioManager = new AudioManager();
  }
  
  startGame() {
    this.currentState = 'intro';
    this.currentBossIndex = 0;
    this.score = 0;
    this.lives = 3;
    this.introTimer = 0;
    this.initializePlayer();
    this.loadBoss(0);
  }
  
  restart() {
    this.currentState = 'intro';
    this.currentBossIndex = 0;
    this.score = 0;
    this.lives = 3;
    this.introTimer = 0;
    this.playerProjectiles = [];
    this.bossProjectiles = [];
    this.particles = [];
    this.initializePlayer();
    this.loadBoss(0);
  }
  
  goToMenu() {
    this.currentState = 'menu';
    this.player = null;
    this.currentBoss = null;
    this.playerProjectiles = [];
    this.bossProjectiles = [];
    this.particles = [];
    this.audioManager.stopMusic();
  }
  
  initializePlayer() {
    this.player = new Player(GAME_WIDTH / 2, GAME_HEIGHT - 100);
  }
  
  loadBoss(index: number) {
    if (index >= this.bosses.length) {
      this.currentState = 'victory';
      this.audioManager.stopMusic();
      return;
    }
    
    this.currentBossIndex = index;
    const BossClass = this.bosses[index];
    this.currentBoss = new BossClass();
    this.bossHealth = 100;
    this.bossProjectiles = [];
    this.particles = [];
    
    // Play boss music
    this.audioManager.playBossMusic(index);
  }
  
  update() {
    this.frameCount++;
    
    switch (this.currentState) {
      case 'menu':
        this.updateMenu();
        break;
      case 'intro':
        this.updateIntro();
        break;
      case 'boss1':
      case 'boss2':
      case 'boss3':
        this.updateGameplay();
        break;
      case 'victory':
      case 'gameover':
        // No updates needed
        break;
    }
  }
  
  updateMenu() {
    // Menu state - no updates needed
  }
  
  updateIntro() {
    this.introTimer++;
    if (this.introTimer > 180) { // 3 seconds at 60 FPS
      this.currentState = `boss${this.currentBossIndex + 1}` as GameState;
    }
  }
  
  updateGameplay() {
    if (!this.player || !this.currentBoss) return;
    
    // Update player
    this.player.update(this.inputManager.getInputState());
    
    // Update boss
    this.currentBoss.update(this.frameCount);
    
    // Update projectiles
    this.playerProjectiles = this.playerProjectiles.filter(p => {
      p.update();
      return p.isActive();
    });
    
    this.bossProjectiles = this.bossProjectiles.filter(p => {
      p.update();
      return p.isActive();
    });
    
    // Update particles
    this.particles = this.particles.filter(p => {
      p.update();
      return p.isActive();
    });
    
    // Player shooting
    if (this.inputManager.getInputState().shooting) {
      const bullets = this.player.shoot();
      this.playerProjectiles.push(...bullets);
    }
    
    // Boss shooting
    const bossBullets = this.currentBoss.shoot(this.frameCount);
    this.bossProjectiles.push(...bossBullets);
    
    // Collision detection
    this.handleCollisions();
    
    // Check boss defeat
    if (this.currentBoss.health <= 0) {
      this.handleBossDefeat();
    }
    
    // Check player defeat
    if (this.player.health <= 0) {
      this.lives--;
      if (this.lives <= 0) {
        this.currentState = 'gameover';
        this.audioManager.stopMusic();
      } else {
        this.player.respawn();
      }
    }
  }
  
  handleCollisions() {
    if (!this.player || !this.currentBoss) return;
    
    // Player bullets vs boss
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const bullet = this.playerProjectiles[i];
      if (this.collisionManager.checkCollision(bullet, this.currentBoss)) {
        this.currentBoss.takeDamage(10);
        this.score += 100;
        bullet.deactivate();
        
        // Create hit effect
        const particle = new Particle(bullet.x, bullet.y, 'hit');
        this.particles.push(particle);
        
        this.bossHealth = (this.currentBoss.health / this.currentBoss.maxHealth) * 100;
      }
    }
    
    // Boss bullets vs player
    for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
      const bullet = this.bossProjectiles[i];
      if (this.collisionManager.checkCollision(bullet, this.player)) {
        if (!this.player.isInvincible()) {
          this.player.takeDamage(25);
          bullet.deactivate();
          
          // Create damage effect
          const particle = new Particle(this.player.x, this.player.y, 'damage');
          this.particles.push(particle);
        }
      }
    }
  }
  
  handleBossDefeat() {
    if (!this.currentBoss) return;
    
    // Create explosion
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const particle = new Particle(
        this.currentBoss.x,
        this.currentBoss.y,
        'explosion',
        angle
      );
      this.particles.push(particle);
    }
    
    this.score += 1000;
    this.audioManager.playSound('bossDefeat');
    
    // Move to next boss
    this.currentBossIndex++;
    if (this.currentBossIndex >= this.bosses.length) {
      this.currentState = 'victory';
      this.audioManager.stopMusic();
    } else {
      this.currentState = 'intro';
      this.introTimer = 0;
      this.loadBoss(this.currentBossIndex);
    }
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.renderBackground();
    
    switch (this.currentState) {
      case 'menu':
        this.renderMenu();
        break;
      case 'intro':
        this.renderIntro();
        break;
      case 'boss1':
      case 'boss2':
      case 'boss3':
        this.renderGameplay();
        break;
      case 'victory':
        this.renderVictory();
        break;
      case 'gameover':
        this.renderGameOver();
        break;
    }
  }
  
  renderBackground() {
    // Draw animated stars
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 137) % GAME_WIDTH;
      const y = (i * 73) % GAME_HEIGHT;
      const size = Math.sin(i + this.frameCount / 60) * 1.5 + 1;
      this.ctx.globalAlpha = 0.5 + Math.sin(i + this.frameCount / 60) * 0.5;
      this.ctx.fillRect(x, y, size, size);
    }
    this.ctx.globalAlpha = 1;
    
    // Draw nebula effect
    this.ctx.fillStyle = 'rgba(100, 50, 150, 0.15)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw grid lines
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < GAME_WIDTH; i += 80) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_HEIGHT);
      this.ctx.stroke();
    }
    for (let i = 0; i < GAME_HEIGHT; i += 80) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_WIDTH, i);
      this.ctx.stroke();
    }
  }
  
  renderMenu() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw decorative lines
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(100, 100);
    this.ctx.lineTo(GAME_WIDTH - 100, 100);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(100, GAME_HEIGHT - 100);
    this.ctx.lineTo(GAME_WIDTH - 100, GAME_HEIGHT - 100);
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#00ffff';
    this.ctx.font = 'bold 60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText('SYDNEY CLARK', GAME_WIDTH / 2, 150);
    
    this.ctx.font = 'bold 40px Arial';
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
    this.ctx.fillText('CORE WARSHIPS', GAME_WIDTH / 2, 220);
    
    this.ctx.font = 'bold 30px Arial';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    this.ctx.fillText('BOSS RUSH MODE', GAME_WIDTH / 2, 290);
    
    this.ctx.shadowColor = 'transparent';
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillText('PRESS START TO BEGIN', GAME_WIDTH / 2, 450);
    
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('Arrow Keys or WASD to Move', GAME_WIDTH / 2, 520);
    this.ctx.fillText('Auto-Fire - Defeat All 3 Bosses', GAME_WIDTH / 2, 560);
  }
  
  renderIntro() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    const bossNames = ['BIG CORE MK.I', 'TETRAN', 'CRYSTAL CORE'];
    const bossColors = ['#ffaa00', '#00ffff', '#ff00ff'];
    
    // Pulsing effect
    const pulse = Math.sin(this.introTimer / 30) * 0.3 + 0.7;
    
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.font = 'bold 50px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.globalAlpha = pulse;
    this.ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText(`STAGE ${this.currentBossIndex + 1}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
    
    this.ctx.font = 'bold 40px Arial';
    this.ctx.fillStyle = bossColors[this.currentBossIndex];
    this.ctx.shadowColor = `rgba(${bossColors[this.currentBossIndex] === '#ffaa00' ? '255, 170, 0' : bossColors[this.currentBossIndex] === '#00ffff' ? '0, 255, 255' : '255, 0, 255'}, 0.8)`;
    this.ctx.fillText(bossNames[this.currentBossIndex], GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    
    this.ctx.globalAlpha = 1;
    this.ctx.shadowColor = 'transparent';
  }
  
  renderGameplay() {
    if (this.player) {
      this.player.render(this.ctx);
    }
    
    if (this.currentBoss) {
      this.currentBoss.render(this.ctx);
    }
    
    // Render projectiles
    for (const bullet of this.playerProjectiles) {
      bullet.render(this.ctx);
    }
    
    for (const bullet of this.bossProjectiles) {
      bullet.render(this.ctx);
    }
    
    // Render particles
    for (const particle of this.particles) {
      particle.render(this.ctx);
    }
  }
  
  renderVictory() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw victory stars
    this.ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 20; i++) {
      const x = (i * 137 + this.frameCount * 2) % GAME_WIDTH;
      const y = (i * 73) % GAME_HEIGHT;
      const size = 3;
      this.ctx.fillRect(x, y, size, size);
    }
    
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = 'bold 80px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
    this.ctx.shadowBlur = 30;
    this.ctx.fillText('VICTORY!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
    
    this.ctx.font = 'bold 40px Arial';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    
    this.ctx.shadowColor = 'transparent';
  }
  
  renderGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw glitch effect
    if (this.frameCount % 10 < 5) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = 'bold 80px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    this.ctx.shadowBlur = 30;
    this.ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
    
    this.ctx.font = 'bold 40px Arial';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    
    this.ctx.shadowColor = 'transparent';
  }
  
  handleKeyDown(key: string) {
    this.inputManager.handleKeyDown(key);
    
    if (key === 'Enter' && this.currentState === 'menu') {
      this.startGame();
    }
  }
  
  handleKeyUp(key: string) {
    this.inputManager.handleKeyUp(key);
  }
}
