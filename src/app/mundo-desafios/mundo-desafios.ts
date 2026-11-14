import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Desafio, DesafioService} from '../service/desafio.service';
import { NgClass } from '@angular/common';
import { AudioService } from '../services/audio';
import { JogadorService } from '../service/jogador.service';


@Component({
  selector: 'app-mundo-desafios',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './mundo-desafios.html',
  styleUrl: './mundo-desafios.scss'
})
export class MundoDesafios implements OnInit {

  desafios: Desafio[] = [];

  desafioSelecionado: Desafio | null = null;

  capituloId!: number;

  progress = 0;
  desafiosConcluidos: number[] = [];

  mundoId!: number;
  imagensMundos: Record<number, string> = {
    //1: 'assets/world11.png',
    1: 'assets/mundos_background/mundo1_background.png',
    2: 'assets/world2_new.png',
    3: 'assets/world33.png',
    4: 'assets/mundos_background/mundo4_background6.png',
    5: 'assets/mundos_background/mundo5_background3.png',
    6: 'assets/mundos_background/mundo6_background2.png',
  };

  
  iconsSoundOnByMundo: Record<number, string> = {
    1: '/assets/elementos/outros/mundo1-sound-on.webp',
    2: '/assets/elementos/outros/mundo1-sound-on.webp',
    3: '/assets/elementos/outros/mundo3-sound-on.png',
    4: '/assets/elementos/outros/mundo4-sound-on.png',
    5: '/assets/elementos/outros/mundo5-sound-on.png',
    6: '/assets/elementos/outros/mundo6-sound-on.png',
  };

  iconsSoundOffByMundo: Record<number, string> = {
    1: '/assets/elementos/outros/sound-off.png',
    2: '/assets/elementos/outros/sound-off.png',
    3: '/assets/elementos/outros/sound-off.png',
    4: '/assets/elementos/outros/sound-off.png',
    5: '/assets/elementos/outros/sound-off.png',
    6: '/assets/elementos/outros/sound-off.png',
  };

imagemFundo = this.imagensMundos[1];


  constructor(
    private desafioService: DesafioService,
    public audioService: AudioService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private jogadorService: JogadorService
  ) {}

  ngOnInit(): void {
    
    this.mundoId = Number(this.route.snapshot.paramMap.get('id'));
    this.capituloId = this.mundoId;

    this.imagemFundo = this.imagensMundos[this.mundoId] ?? this.imagensMundos[1];

    this.carregarDesafios();
    this.carregarProgresso();
  }


  carregarDesafios(): void {

    this.desafioService
      .listarDesafiosPorCapitulo(this.capituloId)
      .subscribe({

        next: (desafios) => {

          console.log(
            'Desafios recebidos:',
            desafios
          );

          this.desafios = desafios;

          if (desafios.length > 0) {
            this.desafioSelecionado = desafios[0];
          }

          this.cdr.detectChanges();
        },

        error: (erro) => {

          console.error(
            'Erro ao carregar desafios:',
            erro
          );

        }

      });
  }

  desafioDisponivel(desafio: any): boolean {

    if (desafio.ordem === 1) {
      return true;
    }

    const desafioAnterior = this.desafios.find(
      d => d.ordem === desafio.ordem - 1
    );

    if (!desafioAnterior) {
      return false;
    }

    return this.desafiosConcluidos.includes(
      desafioAnterior.id
    );
  }

  desafioConcluido(desafio: any): boolean {

    return this.desafiosConcluidos.includes(desafio.id);
  }


  selecionarDesafio(desafio: Desafio): void {

    if (!this.desafioDisponivel(desafio)) {
      return;
    }
    
    this.desafioSelecionado = desafio;

  }


  iniciarDesafio(): void {

    if (!this.desafioSelecionado) {
      return;
    }

    const desafioId = this.desafioSelecionado.id;

    console.log('Mundo atual:', this.mundoId);

    // Mundo 6: abre diretamente a tela específica
    if (this.mundoId === 6) {
      this.router.navigate(['/capitulo/6', desafioId]);
      return;
    }

    // Demais mundos: mantém a navegação atual
    this.router.navigate(['/desafios', desafioId]);
  }

  

  back(): void {
    window.history.back();
  }



  
  carregarProgresso(): void {

    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {
      console.error('Nenhum jogador identificado.');
      this.router.navigate(['/']);
      return;
    }

    this.desafioService
      .buscarDesafiosConcluidos(jogadorId)
      .subscribe({
        next: (desafiosConcluidos) => {

          this.desafiosConcluidos = desafiosConcluidos;
          this.cdr.detectChanges();
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar progresso:',
            erro
          );
        }
      });
  }

  voltarAoMapa(): void {
    this.router.navigate(['/mundos']);
  }

  toggleMusic(): void {
    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }

  get iconSom(): string {
    const mapa = this.audioService.isPlaying()
      ? this.iconsSoundOnByMundo
      : this.iconsSoundOffByMundo;

    return mapa[this.mundoId] ?? mapa[1];   // fallback para o mundo 1
  }

}