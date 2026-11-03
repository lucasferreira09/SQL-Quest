import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: HTMLAudioElement;

  private volume = 0.5;
  private muted = false;

  constructor() {
    this.audio = new Audio('assets/audio/rolling_audio.mp3');

    this.audio.loop = true;
    this.audio.volume = this.volume;
  }

  // =========================
  // MÚSICA
  // =========================

  play(): void {

    // Evita reiniciar a música se ela já estiver tocando
    if (!this.audio.paused) {
      return;
    }

    this.audio.play().catch(error => {
      console.log(
        'Não foi possível iniciar o áudio:',
        error
      );
    });
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  // =========================
  // VOLUME
  // =========================

  setVolume(volume: number): void {

    this.volume = Math.max(0, Math.min(1, volume));

    if (!this.muted) {
      this.audio.volume = this.volume;
    }
  }

  // =========================
  // MUDO
  // =========================

  toggleMute(): void {

    this.muted = !this.muted;

    if (this.muted) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = this.volume;
    }
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }

  isMuted(): boolean {
    return this.muted;
  }

  getVolume(): number {
    return this.volume;
  }

  // =========================
  // EFEITOS SONOROS
  // =========================

  playSfx(path: string): void {

    if (this.muted) {
      return;
    }

    const sound = new Audio(path);

    sound.volume = 0.8;

    sound.play().catch(error => {
      console.log(
        'Não foi possível reproduzir o efeito sonoro:',
        error
      );
    });
  }
}