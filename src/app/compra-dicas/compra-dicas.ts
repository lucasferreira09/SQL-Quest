
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { DicaService } from '../service/dica.service';
import { AudioService } from '../services/audio';


export interface Dica {
  id: number;
  desafioId: number;
  nivel: number;
  texto: string;
  custoOuro: number;
  comprada: boolean;
}


@Component({
  selector: 'app-compra-dicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-dicas.html',
  styleUrls: ['./compra-dicas.scss']
})

export class CompraDicas implements OnInit {

  @Input() desafioId!: number;

  @Output() fechar = new EventEmitter<void>();

  dicas: Dica[] = [];

  ouroJogador = 0;

  carregando = false;

  mensagemErro = '';


  constructor(
    private dicaService: DicaService,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    console.log('COMPONENTE COMPRA-DICAS INICIADO');
    console.log('ID DO DESAFIO:', this.desafioId);
    this.carregarDados();
  }


  // =====================================================
  // CARREGAR DICAS E SALDO
  // =====================================================

  carregarDados(): void {

    this.carregando = true;

    this.mensagemErro = '';

    forkJoin({

      dicas: this.dicaService.listarDicas(this.desafioId),

      jogador: this.dicaService.buscarSaldoJogador()

    }).subscribe({

      next: (resposta) => {

        this.dicas = resposta.dicas;

        this.ouroJogador = resposta.jogador.ouro;

        this.carregando = false;
        
        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao carregar dicas:', erro);

        this.mensagemErro = 'Não foi possível carregar as dicas.';

        this.carregando = false;
      }

    });

  }


  // =====================================================
  // IMAGEM DO NÍVEL
  // =====================================================

  getImagemNivel(nivel: number): string {

    switch (nivel) {

      case 1:
        return 'assets/dicas/nivel1.png';

      case 2:
        return 'assets/dicas/nivel2.png';

      case 3:
        return 'assets/dicas/nivel3.png';

      default:
        return 'assets/dicas/nivel1.png';

    }

  }


  // =====================================================
  // COMPRAR DICA
  // =====================================================

  comprarDica(dica: Dica): void {

    console.log('Dica selecionada:', dica);
    console.log('ID enviado:', dica.id);

    if (!dica.id) {
      this.mensagemErro = 'Identificador da dica inválido.';
      return;
    }

    if (dica.comprada) {
      return;
    }

    if (this.ouroJogador < dica.custoOuro) {
      this.mensagemErro = 'Ouro insuficiente para comprar esta dica.';
      return;
    }

    this.mensagemErro = '';
    
    this.cdr.detectChanges();

    this.dicaService.comprarDica(dica.id).subscribe({

      next: (resposta) => {

        console.log('RESPOSTA DA COMPRA:', resposta);

        this.ouroJogador = resposta.ouroAtual;

        const index = this.dicas.findIndex(
          item => item.id === dica.id
        );

        if (index !== -1) {
          this.dicas[index] = {
            ...this.dicas[index],
            comprada: true,
            texto: resposta.texto ?? this.dicas[index].texto
          };
        }

        console.log('DICA APÓS COMPRA:', this.dicas[index]);
        this.compraDicaSound();
        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao comprar dica:', erro);
        console.error('Resposta do backend:', erro.error);

        this.mensagemErro =
          erro.error?.mensagem ||
          'Não foi possível realizar a compra.';

        this.cdr.detectChanges();
      }
    });
  }


  // =====================================================
  // FECHAR TELA
  // =====================================================

  fecharTela(): void {

    this.fechar.emit();

  }

  compraDicaSound(): void {
    this.audioService.playSfx(
      'assets/audio/buy.mp3'
    );
  }

}
