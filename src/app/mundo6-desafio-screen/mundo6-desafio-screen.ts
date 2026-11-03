
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  DesafioService,
  Desafio
} from '../service/desafio.service';
import { AudioService } from '../services/audio';
import { Recompensas } from '../recompensa-screen/recompensa-screen';
import { CompraDicas } from '../compra-dicas/compra-dicas';
import { ErroConsulta } from '../erro-consulta/erro-consulta';


@Component({
  imports: [
    CommonModule,
    FormsModule,
    Recompensas,
    CompraDicas,
    ErroConsulta
  ],
  selector: 'app-mundo6-desafio-screen',
  styleUrl: './mundo6-desafio-screen.scss',
  templateUrl: './mundo6-desafio-screen.html',
})

export class Mundo6DesafioScreen implements OnInit {
  
  mundoId!: number;
  iconsSoundOnByMundo: Record<number, string> = {
    6: '/assets/elementos/outros/mundo6-sound-on.png',
  };

  iconsSoundOffByMundo: Record<number, string> = {
    6: '/assets/elementos/outros/sound-off.png',
  };
 

  private router = inject(Router);

  desafioId!: number;

  desafio: Desafio | null = null;

  sqlQuery: string = '';

  resultColumns: string[] = [];
  resultRows: any[][] = [];

  mostrarErroResultado = false;
  mostrarErroConsulta = false;
  consultaComErro = '';

  mostrarModalRecompensas = false;
  recompensasGanhos: any[] = [];
  conquistasGanhos: any[] = [];
  ouroGanho = 0;
  xpGanho = 0;

  carregando = false;

  // Modal de dicas
  mostrarCompraDicas = false;

  dicas: any[] = [];

  //ouroAtual = 0;

  carregandoDicas = false;

  comprandoDicaId: number | null = null;

  mensagemErroDica = '';


  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService,
    public audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================================
  // INICIALIZAÇÃO
  // =========================================

  ngOnInit(): void {  
    this.mundoId = this.getMundoIdByDesafio();

    this.desafioId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.desafioId || isNaN(this.desafioId)) {
      console.error('ID do desafio inválido.');
      return;
    }

    this.carregarDesafio();
  }


  // =========================================
  // CARREGAR DESAFIO
  // =========================================

  carregarDesafio(): void {

    this.desafioService
      .buscarDesafio(this.desafioId)
      .subscribe({

        next: (desafio) => {

          this.desafio = desafio;

          console.log('Desafio carregado:', desafio);

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar desafio:',
            erro
          );

        }

      });

  }


  abrirDica(): void {
    this.mostrarCompraDicas = true;
  }

  fecharCompraDicas(): void {
    this.mostrarCompraDicas = false;
  }

  abrirModalRecompensas(resposta: any): void {

    const itens = resposta.itensRecebidos ?? [];
    const conquistas = resposta.conquistasDesbloqueadas ?? [];

    this.recompensasGanhos = itens.map((item: any) => ({
      id: item.ITEM_ID ?? item.itemId,
      nome: item.NOME ?? item.nome,
      descricao: item.DESCRICAO ?? item.descricao,
      imagem: this.normalizarImagem(item.IMAGEM ?? item.imagem),
      quantidade: item.QUANTIDADE ?? item.quantidade ?? 1
    }));

    this.conquistasGanhos = conquistas.map((conquista: any) => ({
      id: conquista.CONQUISTA_ID ?? conquista.conquistaId,
      nome: conquista.NOME ?? conquista.nome,
      descricao: conquista.DESCRICAO ?? conquista.descricao,
      imagem: this.normalizarImagem(conquista.IMAGEM ?? conquista.imagem)
    }));

    this.ouroGanho = resposta.ouroGanho ?? 0;
    this.xpGanho = resposta.xpGanho ?? 0;

    this.mostrarModalRecompensas = true;

    this.cdr.detectChanges();
  }

  normalizarImagem(imagem: string): string {
    if (!imagem) {
      return '';
    }

    return imagem.startsWith('/') ? imagem : '/' + imagem;
  }
  
  recompensaSound(): void {
    this.audioService.playSfx(
      'assets/audio/recompensa-sound.mp3'
    );
  }

  erroConsultaSound(): void {
    this.audioService.playSfx(
      'assets/audio/erro-consulta-sound.mp3'
    );
  }
  // =========================================
  // EXECUTAR CONSULTA SQL
  // =========================================

  executeQuery(): void {

    if (!this.desafio) {
      return;
    }

    if (!this.sqlQuery.trim()) {

      this.resultColumns = [];
      this.resultRows = [];

      this.cdr.detectChanges();
      this.animarErroResultado();

      return;
    }

    const sql = this.sqlQuery.trim();

    console.log('SQL enviada:', sql);

    this.carregando = true;

    this.desafioService
      .executarSql(this.desafio.id, sql)
      .subscribe({

        next: (resposta) => {

          console.log('Resposta do servidor:', resposta);

          if (resposta.resultado) {

            this.resultColumns = resposta.resultado.colunas;

            this.resultRows = resposta.resultado.linhas;

            if (
              this.resultColumns.length === 0 ||
              this.resultRows.length === 0
            ) {
              this.animarErroResultado();
            }

          }

          if (!resposta.desafioConcluido) {
            this.abrirErroConsulta(sql);
            this.erroConsultaSound();
            this.animarErroResultado();
          }

          this.carregando = false;

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao executar SQL:',
            erro
          );

          this.carregando = false;

          this.animarErroResultado();

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================
  // ANIMAÇÃO DE ERRO
  // =========================================

  animarErroResultado(): void {

    this.mostrarErroResultado = true;

    this.cdr.detectChanges();

    setTimeout(() => {

      this.mostrarErroResultado = false;

      this.cdr.detectChanges();

    }, 500);

  }

  abrirErroConsulta(sql: string): void {
    console.error("Abrindo erro consulta");
    this.consultaComErro = sql;
    this.mostrarErroConsulta = true;
  }

  tentarNovamente(): void {
    this.mostrarErroConsulta = false;
  }

  voltarAoMapa(): void {
    this.mostrarErroConsulta = false;
    this.router.navigate(['/mapa']);
  }

  get iconSom(): string {
    const mapa = this.audioService.isPlaying()
      ? this.iconsSoundOnByMundo
      : this.iconsSoundOffByMundo;

    return mapa[this.mundoId] ?? mapa[1];   // fallback para o mundo 1
  }

  toggleMusic(): void {
    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }

  getMundoIdByDesafio(): number {
      return 6;
  }
    
}
