
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio';
import { CommonModule } from '@angular/common';
import { JogadorService } from '../service/jogador.service';
import { GuiaAventureiro } from '../guia-aventureiro/guia-aventureiro';

@Component({
  imports: [CommonModule, GuiaAventureiro],
  standalone: true,
  selector: 'app-home-screen',
  styleUrl: './home-screen.scss',
  templateUrl: './home-screen.html',
})
export class HomeScreen implements OnInit {

  constructor(
    private router: Router,
    private audioService: AudioService,
    private jogadorService: JogadorService
  ) {}

  playButton = 'Jogar';
  optionsButton = 'Opções';
  exitButton = 'Sair';

  musicMuted = false;
  musicVolume = 0.5;
  mostrarInfo = false;
  mostrarHelp = false;

  mostrarLogin = false;
  nomeJogador = '';
  carregandoLogin = false;
  erroLogin = '';

  ngOnInit(): void {
    this.checkIntroducao();
  }

  testSound(): void {
    this.audioService.playSfx('assets/audio/sword.mp3');
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
    const jogador = this.jogadorService.obterJogador();

    if (jogador) {
      this.entrarTelaCheia();
      this.iniciarJogo();
      return;
    }

    this.nomeJogador = '';
    this.erroLogin = '';
    this.mostrarLogin = true;
  }

  entrarNoJogo(): void {
    const nome = this.nomeJogador.trim();

    if (!nome) {
      this.erroLogin = 'Digite seu nome para continuar.';
      return;
    }

    this.carregandoLogin = true;
    this.erroLogin = '';

    this.jogadorService.entrar(nome).subscribe({

      next: (jogador) => {
        
        this.carregandoLogin = false;
        this.mostrarLogin = false;

        this.iniciarJogo();
      },

      error: (erro) => {
        console.error('Erro ao entrar:', erro);

        this.carregandoLogin = false;
        this.erroLogin =
          erro.error?.message ||
          'Não foi possível entrar. Tente novamente.';
      }

    });
  }

  private iniciarJogo(): void {
    
    this.router.navigate(['/mundos'], {
      state: {
        abrirIntroducao: true
      }
    });
  }

  fecharLogin(): void {
    if (this.carregandoLogin) {
      return;
    }

    this.mostrarLogin = false;
    this.erroLogin = '';
  }

  options(): void {
  }

  exit(): void {
    window.close();
  }

  checkIntroducao(): void {
    const infoJaExibida = sessionStorage.getItem('infoHomeExibida') === 'true';

    if (!infoJaExibida) {
      sessionStorage.setItem('infoHomeExibida', 'true');
      this.abrirIntroHome();
    }
  }

  abrirIntroHome(): void {
    this.abrirInfo();
  }

  abrirInfo(): void {
    this.audioService.playSfx("/assets/audio/body-impact.mp3");
    this.mostrarInfo = true;
  }

  fecharInfo(): void {
    this.mostrarInfo = false;
    this.entrarTelaCheia();

    if (!this.audioService.isPlaying()) {
      this.audioService.play();
    }
  }

  entrarTelaCheia(): void {
    const elemento = document.documentElement;

    if (elemento.requestFullscreen) {

      elemento.requestFullscreen()
        .then(() => { console.log('Tela cheia ativada!'); })
        .catch((erro) => { console.error('Erro ao ativar tela cheia:', erro); });
    }
  }

  sairTelaCheia(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  mostrarHelpModal(): void {
    this.mostrarHelp = true;
    this.audioService.playSfx("/assets/audio/body-impact.mp3");
  }

  fecharHelpModal(): void {
    this.entrarTelaCheia();
    this.mostrarHelp = false;
  }
  
}
