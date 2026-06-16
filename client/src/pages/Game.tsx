import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/gameEngine';
import '../styles/game.css';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<string>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHealth, setBossHealth] = useState(100);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize game engine
    const gameEngine = new GameEngine(canvas, ctx);
    gameEngineRef.current = gameEngine;

    // Game loop
    let animationFrameId: number;
    const gameLoop = () => {
      gameEngine.update();
      gameEngine.render();

      // Update UI state
      setGameState(gameEngine.currentState);
      setScore(gameEngine.score);
      setLives(gameEngine.lives);
      setBossHealth(gameEngine.bossHealth);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.handleKeyDown(e.key);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.handleKeyUp(e.key);
    }
  };

  const handleMenuClick = (action: string) => {
    if (gameEngineRef.current) {
      if (action === 'start') {
        gameEngineRef.current.startGame();
      } else if (action === 'restart') {
        gameEngineRef.current.restart();
      } else if (action === 'menu') {
        gameEngineRef.current.goToMenu();
      }
    }
  };

  const handleCanvasClick = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.focus();
    }
  };

  return (
    <div
      className="game-container"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="game-canvas"
        onClick={handleCanvasClick}
      />

      {/* UI Overlay */}
      <div className="game-ui">
        <div className="ui-top-left">
          <div className="lives-display">Lives: {lives}</div>
          <div className="score-display">Score: {score}</div>
        </div>

        <div className="ui-top-center">
          {gameState !== 'menu' && gameState !== 'victory' && gameState !== 'gameover' && (
            <div className="boss-health-display">
              <div className="boss-health-bar">
                <div
                  className="boss-health-fill"
                  style={{ width: `${Math.max(0, bossHealth)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="ui-top-right">
          <div className="stage-display">
            {gameState === 'boss1' && 'STAGE 1'}
            {gameState === 'boss2' && 'STAGE 2'}
            {gameState === 'boss3' && 'STAGE 3'}
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {gameState === 'menu' && (
        <div className="menu-overlay">
          <div className="menu-content">
            <h1>SYDNEY CLARK</h1>
            <h2>CORE WARSHIPS</h2>
            <h3>BOSS RUSH MODE</h3>
            <button onClick={() => handleMenuClick('start')} className="menu-button">
              ▶ START GAME
            </button>
            <div className="menu-info">
              <p>Arrow Keys or WASD to Move</p>
              <p>Auto-Fire - Defeat All 3 Bosses</p>
              <p>Survive and Conquer!</p>
            </div>
          </div>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState === 'victory' && (
        <div className="menu-overlay">
          <div className="menu-content victory">
            <h1>VICTORY!</h1>
            <p className="final-score">Final Score: {score}</p>
            <button onClick={() => handleMenuClick('restart')} className="menu-button">
              PLAY AGAIN
            </button>
            <button onClick={() => handleMenuClick('menu')} className="menu-button secondary">
              MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'gameover' && (
        <div className="menu-overlay">
          <div className="menu-content gameover">
            <h1>GAME OVER</h1>
            <p className="final-score">Final Score: {score}</p>
            <button onClick={() => handleMenuClick('restart')} className="menu-button">
              TRY AGAIN
            </button>
            <button onClick={() => handleMenuClick('menu')} className="menu-button secondary">
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
