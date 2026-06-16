# Sydney Clark and the Core Warships: Boss Rush Mode

A fast-paced HTML5 arcade shooter game featuring three challenging boss encounters in rapid succession.

## 🎮 Game Overview

**Sydney Clark and the Core Warships: Boss Rush Mode** is an action-packed arcade shooter where players take control of Sydney Clark and face three legendary Core Warships in a thrilling battle for survival. Each boss presents unique attack patterns and challenges, requiring skill, timing, and quick reflexes to overcome.

## 🎯 Objective

Defeat all three bosses in sequence to achieve victory. You have three lives to complete the challenge. Survive the onslaught of enemy fire, dodge incoming projectiles, and eliminate each boss to progress to the next stage.

## 🕹️ Controls

- **Arrow Keys** or **WASD** - Move Sydney Clark around the screen
- **Automatic Fire** - Continuous shooting (no button needed)
- **Enter** - Start game from menu
- **Mouse Click** - Focus on game canvas

## 📊 Game Features

### Three Boss Encounters

1. **Stage 1: Big Core MK.I (Gradius)**
   - Difficulty: Easy (Warm-up)
   - Health: 300 HP
   - Attack Patterns: Laser sweeps, bullet sprays, diagonal barrages
   - Strategy: Watch for laser patterns and position in safe zones

2. **Stage 2: Tetran (Salamander)**
   - Difficulty: Medium
   - Health: 400 HP
   - Attack Patterns: Spiral attacks, convergence fire, rapid pulses
   - Strategy: Constant movement is key; predict convergence points

3. **Stage 3: Crystal Core (Gradius II)**
   - Difficulty: Hard (Final Boss)
   - Health: 500 HP
   - Attack Patterns: Laser grids, bullet hell, homing projectiles, combined assault
   - Strategy: Pattern recognition and composure under pressure

### Gameplay Mechanics

- **Player Health**: 3 lives per run; lose all lives for game over
- **Invincibility Frames**: 2-second protection after taking damage
- **Scoring System**: 100 points per bullet hit, 1000 points per boss defeated
- **Auto-Fire**: Continuous shooting with three-bullet spread pattern
- **Collision Detection**: Circle-based hitboxes for accurate gameplay

## 🎨 Visual Design

- **Retro Arcade Aesthetic**: Neon colors with modern polish
- **Animated Backgrounds**: Twinkling stars and nebula effects
- **Dynamic HUD**: Real-time health bars, score display, and stage indicators
- **Particle Effects**: Explosions, hit effects, and damage feedback
- **Boss Animations**: Rotating segments, pulsing crystals, and glowing effects

## 🎵 Audio

The game features three original boss battle tracks:
- **Aircraft Carrier** - Big Core MK.I battle theme
- **Poison of Snake** - Tetran battle theme
- **Take Care!** - Crystal Core battle theme

## 📈 Game States

1. **Menu** - Main title screen with start button
2. **Intro** - Stage introduction with boss name and visual
3. **Boss Battle** - Active gameplay with boss encounter
4. **Victory** - Congratulations screen with final score
5. **Game Over** - Defeat screen with score and restart option

## 🏆 Scoring

| Action | Points |
|--------|--------|
| Bullet Hit | 100 |
| Boss Defeated | 1000 |
| **Total Possible** | **5,300** |

## 🎓 Tips for Success

1. **Learn Patterns**: Each boss cycles through predictable attack patterns. Study them to anticipate incoming fire.
2. **Stay Mobile**: Constant movement helps you avoid projectiles. Don't stay in one place too long.
3. **Aim for Weak Points**: Focus your fire on the boss's central core for maximum damage.
4. **Manage Health**: Use invincibility frames wisely. After taking damage, you have 2 seconds of protection.
5. **Stay Calm**: The final boss combines all attack types. Keep your composure and focus on dodging.

## 🛠️ Technical Details

- **Platform**: HTML5 Canvas
- **Framework**: React 19 + TypeScript
- **Rendering**: 60 FPS game loop
- **Collision Detection**: Circle-based hitbox system
- **Audio**: Web Audio API with fallback support
- **Responsive**: Adapts to different screen sizes

## 📁 Project Structure

```
client/src/
├── pages/
│   └── Game.tsx              # Main game component
├── lib/
│   ├── gameEngine.ts         # Core game loop and state management
│   ├── constants.ts          # Game configuration constants
│   ├── entities/
│   │   ├── Player.ts         # Player character class
│   │   ├── Boss.ts           # Base boss class
│   │   ├── Projectile.ts     # Projectile entity
│   │   ├── Particle.ts       # Particle effects
│   │   └── bosses/
│   │       ├── BigCore.ts    # Big Core MK.I boss
│   │       ├── Tetran.ts     # Tetran boss
│   │       └── CrystalCore.ts # Crystal Core boss
│   └── managers/
│       ├── InputManager.ts   # Keyboard input handling
│       ├── CollisionManager.ts # Collision detection
│       └── AudioManager.ts   # Audio playback
└── styles/
    └── game.css              # Game styling
```

## 🚀 How to Run

1. Install dependencies: `pnpm install`
2. Start development server: `pnpm dev`
3. Open browser to `http://localhost:3000`
4. Click "START GAME" button to begin

## 🔧 Build for Production

```bash
pnpm build
pnpm preview
```

## 📝 Game Design Document

For detailed game design specifications, see `game_design.md` in the project root.

## 🎮 Gameplay Tips

### Early Game (Big Core MK.I)
- This is your warm-up stage. Learn the basic mechanics.
- The laser sweep is predictable - move to the sides when it activates.
- Bullet spray is rapid but has clear gaps - weave through them.

### Mid Game (Tetran)
- Difficulty increases significantly. Stay mobile.
- Convergence attacks require you to predict where bullets will meet.
- The rapid pulse pattern is chaotic - focus on dodging rather than attacking.

### Late Game (Crystal Core)
- The final boss combines all previous patterns plus new ones.
- Homing projectiles are slower but track you - use sharp, quick movements.
- The combined assault is the ultimate test - stay calm and focused.
- Remember: you only need to survive long enough to eliminate the boss.

## 🐛 Known Issues & Limitations

- Audio playback may be restricted by browser autoplay policies
- Mobile touch controls are not yet implemented
- Some visual effects may impact performance on older devices

## 🔮 Future Enhancements

- Power-up system (weapon upgrades, shields, temporary invincibility)
- Difficulty modes (Easy, Normal, Hard)
- Leaderboard system for high scores
- Endless mode with infinite boss waves
- Achievement/badge system
- Mobile touch controls
- Co-op multiplayer mode
- Boss variation patterns for replayability

## 📄 License

This game is created as part of the Sydney Clark and the Core Warships project.

## 🎬 Credits

- **Game Design & Development**: Manus AI
- **Boss Sprites & Characters**: Original arcade game assets (Gradius, Salamander, Gradius II)
- **Music**: Original boss battle themes
- **Engine**: HTML5 Canvas with React

---

**Version**: 1.0  
**Release Date**: June 16, 2026  
**Status**: Complete and Ready to Play

Enjoy the game, and may your reflexes be sharp! 🎮✨
