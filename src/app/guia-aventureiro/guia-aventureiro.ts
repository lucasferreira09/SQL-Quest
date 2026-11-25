import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AudioService } from '../services/audio';

interface BlocoMenu {
  id: string;
  nome: string;
  imagem: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-guia-aventureiro',
  styleUrl: './guia-aventureiro.scss',
  templateUrl: './guia-aventureiro.html',
})
export class GuiaAventureiro {

  constructor(private audioService: AudioService) {}
  
  @Output() fechar = new EventEmitter<void>();

  secaoSelecionada = 'sua-jornada';
  fechando = false;

  blocos: BlocoMenu[] = [
    {
      id: 'sua-jornada',
      nome: 'Sua Jornada',
      imagem: 'assets/guia/sua-jornada/menu-sua-jornada.webp'
    },
    {
      id: 'recompensas',
      nome: 'Recompensas',
      imagem: 'assets/guia/recompensas/menu-recompensas.webp'
    },
    {
      id: 'como-resolver',
      nome: 'Como Resolver',
      imagem: 'assets/guia/como-resolver/menu-como-resolver.webp'
    },
    {
      id: 'dicas',
      nome: 'Dicas',
      imagem: 'assets/guia/dicas/menu-dicas.webp'
    },
    {
      id: 'inventario',
      nome: 'Inventário',
      imagem: 'assets/guia/inventario/menu-inventario.webp'
    }/*,
    {
      id: 'controles',
      nome: 'Controles',
      imagem: 'assets/guia/controles/menu-controles.webp'
    }*/
  ];

  selecionarSecao(id: string): void {
    this.audioService.playSfx("/assets/audio/open_dica_sound.mp3");
    this.secaoSelecionada = id;
  }

  
  fecharGuia(): void {
    if (this.fechando) return;

    this.audioService.playSfx("/assets/audio/body-impact.mp3");
    this.fechando = true;

    if (!this.audioService.isPlaying()) {
      this.audioService.play();
    }
    setTimeout(() => {
      this.fechar.emit();
    }, 400);
  }
}