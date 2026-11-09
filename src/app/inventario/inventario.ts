import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { InventarioService } from '../service/inventario.service';
import { AudioService } from '../services/audio';
import { JogadorService } from '../service/jogador.service';
import { Router } from '@angular/router';

// =========================
// INTERFACES
// =========================

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

export interface DicasCompradas {
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
export class InventarioComponent implements OnInit, OnDestroy {

  // =========================
  // CATEGORIAS
  // =========================

  categorias: Categoria[] = [
    { id: 'itens', nome: 'Itens' },
    { id: 'conquistas', nome: 'Conquistas' },
    { id: 'dicas', nome: 'Dicas' },
    { id: 'recompensas', nome: 'Recompensas' }
  ];

  categoriaSelecionada = 'itens';

  // =========================
  // DADOS
  // =========================

  itens: ItemInventario[] = [];
  conquistas: ConquistaInventario[] = [];
  dicas: DicasCompradas[] = [];

  itemSelecionado: ItemInventario | null = null;
  conquistaSelecionada: ConquistaInventario | null = null;
  dicaSelecionada: DicasCompradas | null = null;

  // =========================
  // PAGINAÇÃO
  // =========================

  readonly porPagina = 20;

  paginaItens = 0;
  paginaConquistas = 0;
  paginaDicas = 0;

  // =========================
  // ESTADOS
  // =========================

  carregando = false;
  erro = '';

  constructor(
    private inventarioService: InventarioService,
    public audioService: AudioService,
    private jogadorService: JogadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.audioService.entrarInventario();

    this.carregarCategoria(this.categoriaSelecionada);
  }

  ngOnDestroy(): void {
    this.audioService.sairInventario();
  }

  // =========================
  // SELECIONAR CATEGORIA
  // =========================

  selecionarCategoria(categoria: string): void {

    this.categoriaSelecionada = categoria;

    this.itemSelecionado = null;
    this.conquistaSelecionada = null;
    this.dicaSelecionada = null;

    this.carregarCategoria(categoria);
  }

  // =========================
  // CARREGAR CATEGORIA
  // =========================

  carregarCategoria(categoria: string): void {

    this.carregando = true;
    this.erro = '';

    // Reinicia as páginas
    this.paginaItens = 0;
    this.paginaConquistas = 0;
    this.paginaDicas = 0;

    // Limpa seleções anteriores
    this.itemSelecionado = null;
    this.conquistaSelecionada = null;
    this.dicaSelecionada = null;

    this.cdr.detectChanges();

    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {

      console.error('Nenhum jogador identificado.');

      this.carregando = false;
      this.router.navigate(['/']);

      return;
    }

    // =========================
    // ITENS
    // =========================

    if (categoria === 'itens') {

      this.inventarioService.listar(jogadorId).subscribe({

        next: (dados) => {

          this.itens = dados;

          // Seleciona o primeiro item da página
          this.itemSelecionado = this.itensPagina[0] ?? null;

          this.carregando = false;

          this.cdr.detectChanges();
        },

        error: (erro) => {

          console.error('Erro ao carregar itens:', erro);

          this.itens = [];
          this.itemSelecionado = null;

          this.erro = 'Não foi possível carregar os itens.';

          this.carregando = false;

          this.cdr.detectChanges();
        }
      });

    }

    // =========================
    // CONQUISTAS
    // =========================

    else if (categoria === 'conquistas') {

      this.inventarioService.listarConquistas(jogadorId).subscribe({

        next: (dados) => {

          this.conquistas = dados;

          // Seleciona a primeira conquista da página
          this.conquistaSelecionada = this.conquistasPagina[0] ?? null;

          this.carregando = false;

          this.cdr.detectChanges();
        },

        error: (erro) => {

          console.error('Erro ao carregar conquistas:', erro);

          this.conquistas = [];
          this.conquistaSelecionada = null;

          this.erro = 'Não foi possível carregar as conquistas.';

          this.carregando = false;

          this.cdr.detectChanges();
        }
      });

    }

    // =========================
    // DICAS
    // =========================

    else if (categoria === 'dicas') {

      this.inventarioService.listarDicas(jogadorId).subscribe({

        next: (dados) => {

          this.dicas = dados;

          // Seleciona a primeira dica da página
          this.dicaSelecionada = this.dicasPagina[0] ?? null;

          this.carregando = false;

          this.cdr.detectChanges();
        },

        error: (erro) => {

          console.error('Erro ao carregar dicas:', erro);

          this.dicas = [];
          this.dicaSelecionada = null;

          this.erro = 'Não foi possível carregar as dicas.';

          this.carregando = false;

          this.cdr.detectChanges();
        }
      });

    }

    // =========================
    // OUTRAS CATEGORIAS
    // =========================

    else {

      this.itens = [];
      this.conquistas = [];
      this.dicas = [];

      this.carregando = false;

      this.cdr.detectChanges();
    }
  }

  // =========================
  // SELECIONAR ELEMENTOS
  // =========================

  selecionarItem(item: ItemInventario): void {
    this.itemSelecionado = item;
  }

  selecionarConquista(conquista: ConquistaInventario): void {
    this.conquistaSelecionada = conquista;
  }

  selecionarDica(dica: DicasCompradas): void {
    this.dicaSelecionada = dica;
  }

  // =========================
  // PAGINAÇÃO DE ITENS
  // =========================

  get itensPagina(): ItemInventario[] {

    const inicio = this.paginaItens * this.porPagina;

    return this.itens.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginasItens(): number {

    return Math.max(
      1,
      Math.ceil(this.itens.length / this.porPagina)
    );
  }

  paginaAnteriorItens(): void {

    if (this.paginaItens > 0) {

      this.paginaItens--;

      this.itemSelecionado = this.itensPagina[0] ?? null;
    }
  }

  proximaPaginaItens(): void {

    if (this.paginaItens < this.totalPaginasItens - 1) {

      this.paginaItens++;

      this.itemSelecionado = this.itensPagina[0] ?? null;
    }
  }

  // =========================
  // PAGINAÇÃO DE CONQUISTAS
  // =========================

  get conquistasPagina(): ConquistaInventario[] {

    const inicio = this.paginaConquistas * this.porPagina;

    return this.conquistas.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginasConquistas(): number {

    return Math.max(
      1,
      Math.ceil(this.conquistas.length / this.porPagina)
    );
  }

  paginaAnteriorConquistas(): void {

    if (this.paginaConquistas > 0) {

      this.paginaConquistas--;

      this.conquistaSelecionada = this.conquistasPagina[0] ?? null;
    }
  }

  proximaPaginaConquistas(): void {

    if (this.paginaConquistas < this.totalPaginasConquistas - 1) {

      this.paginaConquistas++;

      this.conquistaSelecionada = this.conquistasPagina[0] ?? null;
    }
  }

  // =========================
  // PAGINAÇÃO DE DICAS
  // =========================

  get dicasPagina(): DicasCompradas[] {

    const inicio = this.paginaDicas * this.porPagina;

    return this.dicas.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginasDicas(): number {

    return Math.max(
      1,
      Math.ceil(this.dicas.length / this.porPagina)
    );
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

  alternarInventarioAudio(): void {
    this.audioService.alternarInventarioAudio();
  }

  
  voltar(): void {
    window.history.back();
  }

  imagemFallback(event: Event, tipo: string): void {
    const img = event.target as HTMLImageElement;

    img.onerror = null; // Impede novas tentativas de fallback
    if (tipo == "item") {
      img.src = '/assets/recompensas/itens/exemplo-item-image.webp';
    } else if (tipo == "conquista") {
      img.src = '/assets/recompensas/conquistas/exemplo-conquista-image.webp';
    }
  }
}