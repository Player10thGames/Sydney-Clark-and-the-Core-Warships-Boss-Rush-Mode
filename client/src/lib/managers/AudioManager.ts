import { MUSIC_VOLUME, SFX_VOLUME } from '../constants';

export class AudioManager {
  private currentMusic: HTMLAudioElement | null = null;
  private musicVolume: number = MUSIC_VOLUME;
  private sfxVolume: number = SFX_VOLUME;
  
  private musicTracks: { [key: number]: string } = {
    0: '/Big Core MK.I from Gradius/01. Aircraft Carrier (Big Core MK.I from Gradius - Stage 1 Boss).mp3',
    1: '/Tetran from Salamander/02. Poison of Snake (Tetran from Salamander - Stage 2 Boss).mp3',
    2: '/Crystal Core from Gradius II/03. Take Care! (Crystal Core from Gradius II - Stage 3 Boss).mp3',
  };
  
  private soundEffects: { [key: string]: string } = {
    shoot: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    hit: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    damage: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    bossDefeat: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  };

  playBossMusic(bossIndex: number) {
    this.stopMusic();
    
    const trackPath = this.musicTracks[bossIndex];
    if (!trackPath) return;
    
    try {
      this.currentMusic = new Audio(trackPath);
      this.currentMusic.volume = this.musicVolume;
      this.currentMusic.loop = true;
      this.currentMusic.play().catch(() => {
        // Audio playback might fail due to browser restrictions
        console.log('Audio playback failed');
      });
    } catch (e) {
      console.error('Failed to load music:', e);
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic = null;
    }
  }

  playSound(soundName: string) {
    try {
      const soundPath = this.soundEffects[soundName];
      if (!soundPath) return;
      
      const audio = new Audio(soundPath);
      audio.volume = this.sfxVolume;
      audio.play().catch(() => {
        // Audio playback might fail
      });
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
  }

  setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}
