
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

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

  // Modo de demonstração
  modoTeste = false;

  recompensasTeste: Recompensa[] = [
    {
      id: 1,
      nome: 'Lupa do Investigador',
      descricao: 'Uma lupa encantada que permite encontrar exatamente os registros desejados.',
      image: '/assets/recompensas/itens/lupa-investigador.png',
      quantidade: 1
    },
    {
      id: 2,
      nome: 'Pergaminho Antigo',
      descricao: 'Um pergaminho contendo conhecimentos esquecidos sobre o reino de Aethel.',
      image: '/assets/recompensas/itens/armadura-dados.png',
      quantidade: 2
    },
    {
      id: 3,
      nome: 'Chave Dourada',
      descricao: 'Uma chave misteriosa capaz de abrir baús escondidos.',
      image: '/assets/recompensas/itens/cajado-consultas.png',
      quantidade: 1
    },
    {
      id: 4,
      nome: 'Cristal Mágico',
      descricao: 'Um cristal que concentra uma poderosa energia mágica.',
      image: '/assets/recompensas/itens/adaga-estrategia.png',
      quantidade: 3
    }
  ];

  conquistasTeste: Conquista[] = [
    {
      id: 1,
      nome: 'O Despertar do Guardião',
      descricao: 'Recuperou todos os habitantes de Aethel utilizando seus primeiros comandos SQL.',
      image: '/assets/recompensas/conquistas/despertar_guardiao.png'
    },
    {
      id: 2,
      nome: 'Restaurador do Registro',
      descricao: 'Recuperou as principais informações dos habitantes, reconstruindo parte do Grande Registro.',
      image                                                                                                                                                                     : '/assets/recompensas/conquistas/restaurador_registro.png'
    }
  ];



  // Dados recebidos do componente pai
  @Input() recompensas: Recompensa[] = [];
  @Input() conquistas: Conquista[] = [];

  @Input() ouroGanho = 0;
  @Input() xpGanho = 0;

  // Evento para fechar o modal
  @Output() fechar = new EventEmitter<void>();

  // Elementos selecionados
  recompensaSelecionada: Recompensa | null = null;
  conquistaSelecionada: Conquista | null = null;

  tipoSelecionado: 'item' | 'conquista' | null = null;

  ngOnChanges(changes: SimpleChanges): void {

    if (this.modoTeste) {
      return;
    }
      
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

  ativarModoTeste(): void {
    this.recompensas = this.recompensasTeste;
    this.conquistas = this.conquistasTeste;

    this.ouroGanho = 30;
    this.xpGanho = 150;

    if (this.recompensas.length > 0) {
      this.selecionarRecompensa(this.recompensas[0]);
    }
  }
}
