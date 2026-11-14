
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: HTMLAudioElement;
  private inventoryAudio: HTMLAudioElement;

  private volume = 0.5;
  private muted = false;

  // Guarda se a música do mundo estava tocando antes de entrar no inventário.
  private mundoEstavaTocando = false;

  constructor() {
    this.audio = new Audio('assets/audio/guardian_audio.mp3');
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'none';

    this.inventoryAudio = new Audio('assets/audio/inventario_audio1.mp3');
    this.inventoryAudio.loop = true;
    this.inventoryAudio.volume = this.volume;
    this.inventoryAudio.preload = 'none';
  }

  // =========================
  // MÚSICA DO MUNDO
  // =========================

  play(): void {
    if (!this.audio.paused) {
      return;
    }

    this.audio.play().catch(error => {
      console.log('Não foi possível iniciar a música do mundo:', error);
    });
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  pausarInventarioAudio(): void {
    this.inventoryAudio.pause();
  }

  

  continuarInventarioAudio(): void {
    if (this.muted) {
      return;
    }

    this.inventoryAudio.play().catch(error => {
      console.log('Não foi possível continuar a música do inventário:', error);
    });
  }

  inventaisPlaying(): boolean {
    return !this.inventoryAudio.paused;
  }

  alternarInventarioAudio(): void {
    if (this.inventoryAudio.paused) {
      this.continuarInventarioAudio();
    } else {
      this.pausarInventarioAudio();
    }
  }


  entrarInventario(): void {

    // Evita salvar novamente o estado caso o método seja chamado mais de uma vez.
    if (this.inventoryAudio.paused === false) {
      return;
    }

    // Guarda o estado anterior da música do mundo.
    this.mundoEstavaTocando = !this.audio.paused;

    // Pausa a música do mundo sem reiniciar.
    this.audio.pause();

    // Inicia a música do inventário.
    if (!this.muted) {
      this.inventoryAudio.volume = 0.3;

      this.inventoryAudio.currentTime = 0;

      this.inventoryAudio.play().catch(error => {
        console.log('Não foi possível iniciar a música do inventário:', error);
      });
    }
  }

  // =========================
  // SAIR DO INVENTÁRIO
  // =========================

  sairInventario(): void {

    // Para a música do inventário.
    this.inventoryAudio.pause();
    this.inventoryAudio.currentTime = 0;

    // Continua a música do mundo somente se ela estava tocando antes.
    if (this.mundoEstavaTocando) {
      this.play();
    }

    this.mundoEstavaTocando = false;
  }

  // =========================
  // VOLUME
  // =========================

  setVolume(volume: number): void {

    this.volume = Math.max(0, Math.min(1, volume));

    if (!this.muted) {
      this.audio.volume = this.volume;
      this.inventoryAudio.volume = this.volume;
    }
  }

  // =========================
  // MUDO
  // =========================

  toggleMute(): void {

    this.muted = !this.muted;

    if (this.muted) {
      this.audio.volume = 0;
      this.inventoryAudio.volume = 0;
    } else {
      this.audio.volume = this.volume;
      this.inventoryAudio.volume = this.volume;
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
      console.log('Não foi possível reproduzir o efeito sonoro:', error);
    });
  }
}
