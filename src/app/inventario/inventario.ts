
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InventarioService } from '../service/inventario.service';
import { Timestamp } from 'rxjs';
import { AudioService } from '../services/audio';
import { JogadorService } from '../service/jogador.service';
import { Router } from '@angular/router';

export interface Categoria {
  id: string;
  nome: string;
}

export interface ItemInventario {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  quantidade: number;
  imageUrl: string | null;
}

export interface ConquistaInventario {
  id: number;
  nome: string;
  descricao: string;
  imageUrl: string | null;
  desbloqueadaEm: string | null;
}

export interface DicasCompradas { // ADDED BY ME
  dicaId: number;
  desafioId: number;
  nivel: string;
  texto: string;
  custoOuro: number;
  compradoEm: string;
}




@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class InventarioComponent implements OnInit {

  categorias: Categoria[] = [
    { id: 'itens', nome: 'Itens' },
    { id: 'conquistas', nome: 'Conquistas' },
    { id: 'dicas', nome: 'Dicas' },
    { id: 'recompensas', nome: 'Recompensas' }
  ];

  categoriaSelecionada = 'itens';
  itens: ItemInventario[] = [];
  conquistas: ConquistaInventario[] = [];
  itemSelecionado: ItemInventario | null = null;
  conquistaSelecionada: ConquistaInventario | null = null;

  dicas: DicasCompradas[] = []; // ADDED BY ME
  dicaSelecionada: DicasCompradas | null = null; // ADDED BY ME

  carregando = false;
  erro = '';

  constructor(
    private inventarioService: InventarioService,
    private audioService: AudioService,
    private jogadorService: JogadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('InventarioComponent foi iniciado!');
    console.log('Categoria inicial:', this.categoriaSelecionada);

    this.carregarCategoria(this.categoriaSelecionada);
  }

  selecionarCategoria(categoria: string): void {

    this.categoriaSelecionada = categoria;

    this.itemSelecionado = null;
    this.conquistaSelecionada = null;

    this.dicaSelecionada = null // ADDED BY ME
    
    this.carregarCategoria(categoria);
    this.cdr.detectChanges();
  }
    
  
  carregarCategoria(categoria: string): void {

    console.log('Carregando categoria:', categoria);

    this.carregando = true;
    this.erro = '';

    this.itemSelecionado = null;
    this.conquistaSelecionada = null;
    this.dicaSelecionada = null;  // ADDED BY ME

    this.cdr.detectChanges();

    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {
      console.error('Nenhum jogador identificado.');
      this.router.navigate(['/']);
      return;
    }

    if (categoria === 'itens') {


      this.inventarioService.listar(jogadorId).subscribe({

        next: (dados) => {

          console.log('Itens carregados:', dados);

          this.itens = dados;

          this.itemSelecionado =
            dados.length > 0 ? dados[0] : null;

          this.carregando = false;
          this.cdr.detectChanges();
        },

        error: (erro) => {

          console.error('Erro ao carregar itens:', erro);

          this.itens = [];
          this.erro = 'Não foi possível carregar os itens.';
          this.carregando = false;

          this.cdr.detectChanges();
        }
      });

    } else if (categoria === 'conquistas') {

      this.inventarioService
        .listarConquistas(jogadorId)
        .subscribe({

          next: (dados) => {

            console.log('Conquistas carregadas:', dados);

            this.conquistas = dados;

            this.conquistaSelecionada =
              dados.length > 0 ? dados[0] : null;

            this.carregando = false;
            this.cdr.detectChanges();
          },

          error: (erro) => {

            console.error('Erro ao carregar conquistas:', erro);

            this.conquistas = [];
            this.erro = 'Não foi possível carregar as conquistas.';
            this.carregando = false;

            this.cdr.detectChanges();
          }
        });

    } else if (categoria === 'dicas'){

      this.inventarioService
        .listarDicas(jogadorId)
        .subscribe({

          next: (dados) => {

            console.log('Conquistas carregadas:', dados);

            this.dicas = dados;

            this.paginaDicas = 0;                       // <- novo
            this.dicaSelecionada = dados.length > 0 ? dados[0] : null;

            this.carregando = false;
            this.cdr.detectChanges();
          },

          error: (erro) => {

            console.error('Erro ao carregar dicas:', erro);

            this.dicas = [];
            this.erro = 'Não foi possível carregar as dicas.';
            this.carregando = false;
            this.cdr.detectChanges();
          }
        });


    } else {
      this.itens = [];
      this.conquistas = [];

      this.carregando = false;
      this.cdr.detectChanges();
    }
    
    this.cdr.detectChanges();
  }


  selecionarItem(item: ItemInventario): void {
    this.itemSelecionado = item;
  }
  selecionarConquista(conquista: ConquistaInventario): void {
    this.conquistaSelecionada = conquista;
  }
  selecionarDica(dica: DicasCompradas): void {
    this.dicaSelecionada = dica;
  }

  voltar(): void {
    window.history.back();
  }

  readonly porPagina = 20;
  paginaDicas = 0;

  get dicasPagina(): DicasCompradas[] {
    const ini = this.paginaDicas * this.porPagina;
    return this.dicas.slice(ini, ini + this.porPagina);
  }

  get totalPaginasDicas(): number {
    return Math.max(1, Math.ceil(this.dicas.length / this.porPagina));
  }

  paginaAnteriorDicas(): void {
    if (this.paginaDicas > 0) {
      this.paginaDicas--;
      this.dicaSelecionada = this.dicasPagina[0] ?? null;
    }
  }

  proximaPaginaDicas(): void {
    if (this.paginaDicas < this.totalPaginasDicas - 1) {
      this.paginaDicas++;
      this.dicaSelecionada = this.dicasPagina[0] ?? null;
    }
  }
}
