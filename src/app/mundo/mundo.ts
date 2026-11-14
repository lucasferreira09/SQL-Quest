import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Capitulo,  Desafio,  DesafioService } from '../service/desafio.service';
import { Router } from '@angular/router';
import { IntroModal } from '../intro-modal/intro-modal';
import { AudioService } from '../services/audio';

@Component({
  selector: 'app-mundo',
  standalone: true,
  imports: [CommonModule, IntroModal],
  templateUrl: './mundo.html',
  styleUrl: './mundo.scss'
})
export class Mundo implements OnInit {

  capitulos: Capitulo[] = [];
  desafios: Desafio[] = [];

  capituloSelecionado: Capitulo | null = null;
  capituloHover: Capitulo | null = null;
  carregandoCapitulos = true;
  erroCarregamento = false;

  mostrarIntroducao = false;


  progress = 0;

  constructor(
    private desafioService: DesafioService,
    public audioService: AudioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    this.carregarCapitulos();
  }

  carregarDesafioPorCapitulo() {
    this.desafioService.listarDesafiosPorCapitulo(1)
    .subscribe({
      next: (desafios) => {

        this.desafios = desafios;
      }
    });
  }

  carregarCapitulos(): void {

    this.carregandoCapitulos = true;
    this.erroCarregamento = false;

    this.desafioService.listarCapitulos().subscribe({
      next: (capitulos) => {

        this.capitulos = capitulos;

        if (capitulos.length > 0) {
          this.capituloSelecionado = capitulos[0];
        }

        this.carregandoCapitulos = false;
        this.checkIntroducao();
        this.cdr.detectChanges();  
      },

      error: (erro) => {

        console.error('Erro ao carregar capítulos:',erro);
        this.carregandoCapitulos = false;
        this.erroCarregamento = true;
      }
    });
  }

  checkIntroducao(): void {
      
    const deveMostrarIntroMundos = history.state?.abrirIntroducao === true;

    const introMundosJaExibida = sessionStorage.getItem('introMundoExibida') === 'true';

    this.mostrarIntroducao = deveMostrarIntroMundos && !introMundosJaExibida;

    if (this.mostrarIntroducao) {
      sessionStorage.setItem('introMundoExibida', 'true');
      this.audioService.playSfx('/assets/audio/sword.mp3')
    }
  }

  selecionarCapitulo(capitulo: Capitulo): void {
    this.capituloSelecionado = capitulo;
  }

  getCapituloFilter(capitulo: Capitulo): string {

    const isSelected =
      this.capituloSelecionado?.id === capitulo.id;

    const isHovered =
      this.capituloHover?.id === capitulo.id;

    if (!isSelected && !isHovered) {
      return 'none';
    }

    return `
      drop-shadow(0 0 8px rgba(255, 255, 255, 0.85))
      drop-shadow(0 0 20px rgba(250, 250, 250, 0.55))
      drop-shadow(0 8px 10px rgba(255, 255, 255, 0.45))
    `;
  }

  entrarNoCapitulo(): void {

    if (!this.capituloSelecionado) {
      return;
    }

    this.router.navigate([
      `/desafios/capitulo/${this.capituloSelecionado.id}`
    ]);
  }
  
  fecharIntroducao(): void {
    this.mostrarIntroducao = false;
  }
    
  openInventario(): void {
    this.router.navigate([`/inventario`]);
  }

  back(): void {
    this.router.navigate(['/home']);
  } 

  toggleMusic(): void {
    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }
}