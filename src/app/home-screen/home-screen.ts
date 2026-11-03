import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio';
import { CommonModule } from '@angular/common';


@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-home-screen',
  styleUrl: './home-screen.scss',
  templateUrl: './home-screen.html',
})

export class HomeScreen implements OnInit {

  constructor(
    private router: Router,
    private audioService: AudioService
  ) {}

  playButton = 'Play';
  optionsButton = 'Options'
  exitButton = 'Exit'

  musicMuted = false;
  musicVolume = 0.5;
  mostrarInfo = false;

  ngOnInit(): void {
    this.abrirInfo()
  }

  testSound(): void {
    this.audioService.playSfx(
      'assets/audio/sword.mp3'
    );
  }


  toggleMusic(): void {

    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }


  toggleMute(): void {

    this.audioService.toggleMute();
    this.musicMuted = this.audioService.isMuted();
  }

  changeVolume(event: Event): void {

    const input = event.target as HTMLInputElement;

    const volume = Number(input.value);

    this.musicVolume = volume;

    this.audioService.setVolume(volume);
  }

  play(): void {
    console.log('Play');
    this.testSound()
    this.router.navigate(['/mundos'], {
    state: {
        abrirIntroducao: true
      }
    });
  }

  options(): void {
    console.log('Opções');
  }

  exit(): void {
    console.log('Sair');
  }

  abrirInfo(): void {
    this.mostrarInfo = true;
    console.log("ABRIR INFO")
  }

  fecharInfo(): void {
    this.mostrarInfo = false;

    if (!this.audioService.isPlaying()) {
      this.audioService.play();
    }
  }

  win(): void {
    this.router.navigate(['/win']);
  }
}
