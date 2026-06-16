export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shooting: boolean;
}

export class InputManager {
  private keys: Map<string, boolean> = new Map();

  constructor() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e.key));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e.key));
  }

  handleKeyDown(key: string) {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey === 'arrowup' || lowerKey === 'w') {
      this.keys.set('up', true);
    } else if (lowerKey === 'arrowdown' || lowerKey === 's') {
      this.keys.set('down', true);
    } else if (lowerKey === 'arrowleft' || lowerKey === 'a') {
      this.keys.set('left', true);
    } else if (lowerKey === 'arrowright' || lowerKey === 'd') {
      this.keys.set('right', true);
    }
    
    // Always shooting
    this.keys.set('shooting', true);
  }

  handleKeyUp(key: string) {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey === 'arrowup' || lowerKey === 'w') {
      this.keys.set('up', false);
    } else if (lowerKey === 'arrowdown' || lowerKey === 's') {
      this.keys.set('down', false);
    } else if (lowerKey === 'arrowleft' || lowerKey === 'a') {
      this.keys.set('left', false);
    } else if (lowerKey === 'arrowright' || lowerKey === 'd') {
      this.keys.set('right', false);
    }
  }

  getInputState(): InputState {
    return {
      up: this.keys.get('up') || false,
      down: this.keys.get('down') || false,
      left: this.keys.get('left') || false,
      right: this.keys.get('right') || false,
      shooting: this.keys.get('shooting') || false,
    };
  }

  reset() {
    this.keys.clear();
  }
}
