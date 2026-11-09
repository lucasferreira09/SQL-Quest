
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

export interface Recompensa {
  id: number;
  nome: string;
  descricao: string;
  image: string;
  quantidade: number;
}

export interface Conquista {
  id: number;
  nome: string;
  descricao: string;
  image: string;
}

@Component({
  selector: 'app-recompensas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recompensa-screen.html',
  styleUrl: './recompensa-screen.scss'
})
export class Recompensas implements OnChanges {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  @Input() proximoDesafio = 0;
  
  // Dados recebidos do componente pai
  @Input() recompensas: Recompensa[] = [];
  @Input() conquistas: Conquista[] = [];

  @Input() ouroGanho = 0;
  @Input() xpGanho = 0;

  @Input() mensagem = '';
  
  // Evento para fechar o modal
  @Output() fechar = new EventEmitter<void>();

  // Elementos selecionados
  recompensaSelecionada: Recompensa | null = null;
  conquistaSelecionada: Conquista | null = null;

  tipoSelecionado: 'item' | 'conquista' | null = null;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['recompensas'] || changes['conquistas']) {

      // Prioriza selecionar o primeiro item
      if (this.recompensas.length > 0) {
        this.selecionarRecompensa(this.recompensas[0]);

      } else if (this.conquistas.length > 0) {
        this.selecionarConquista(this.conquistas[0]);

      } else {
        this.recompensaSelecionada = null;
        this.conquistaSelecionada = null;
        this.tipoSelecionado = null;
      }
    }
  }

  selecionarRecompensa(recompensa: Recompensa): void {
    this.recompensaSelecionada = recompensa;
    this.conquistaSelecionada = null;
    this.tipoSelecionado = 'item';
  }

  selecionarConquista(conquista: Conquista): void {
    this.conquistaSelecionada = conquista;
    this.recompensaSelecionada = null;
    this.tipoSelecionado = 'conquista';
  }

  fecharModal(): void {
    this.fechar.emit();
  }

  avancarDesafio(): void {
    this.fecharModal();

    // Último desafio do capítulo 6
    if (this.proximoDesafio > 23) {
      this.router.navigate(['/mundos']);
      return;
    }

    this.router.navigate(['/desafios', this.proximoDesafio]);
  }
}
