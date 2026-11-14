import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { DesafioService, Desafio, BlocoDesafio } from '../service/desafio.service';
import { CommonModule } from '@angular/common';
import { AudioService } from '../services/audio';
import { Observable, catchError, map, throwError} from 'rxjs';
import { Recompensas } from '../recompensa-screen/recompensa-screen';
import { DicaService } from '../service/dica.service';
import { CompraDicas } from '../compra-dicas/compra-dicas';
import { ErroConsulta } from '../erro-consulta/erro-consulta';
import { JogadorService } from '../service/jogador.service';

@Component({
  imports: [CommonModule, DragDropModule, Recompensas, CompraDicas, ErroConsulta],
  selector: 'app-challenges-world-1',
  styleUrl: './challenges-world-1.scss',
  templateUrl: './challenges-world-1.html',
})
export class ChallengesWorld1 implements OnInit {

  private router = inject(Router);

  desafioId!: number;
  proximoDesafio!: number;
  desafioAnterior!: number;

  desafio: Desafio | null = null;

  carregandoMundo = true;
  conquistasGanhos: any[] = [];
  queryBlocks: BlocoDesafio[] = [];
  availableBlocks: BlocoDesafio[] = [];

  blocosIniciais: BlocoDesafio[] = [];

  resultColumns: string[] = [];
  resultRows: any[][] = [];

  // Modal de dicas
  mostrarCompraDicas = false;
  mostrarErroConsulta = false;
  consultaComErro = '';

  dicas: any[] = [];

  ouroAtual = 0;

  carregandoDicas = false;

  comprandoDicaId: number | null = null;

  mensagemErroDica = '';
  mensagemRecompensa = '';

  mundoId!: number;
  imagensDesafioMundos: Record<number, string> = {
    //1: 'assets/telas/desafios/mundo1_tela_desafio.webp',
    1: 'assets/mundos_background/tela_desafio/mundo1_tela_desafio.png',
    2: 'assets/world_new.png',
    3: 'assets/world3_new_v3.png',
    4: 'assets/mundos_background/tela_desafio/mundo4_desafio_screen2.png',
    5: 'assets/mundos_background/tela_desafio/mundo5_tela_desafio.png',
  };

  iconsSoundOnByMundo: Record<number, string> = {
    1: '/assets/elementos/outros/mundo1-sound-on.webp',
    2: '/assets/elementos/outros/mundo1-sound-on.webp',
    3: '/assets/elementos/outros/mundo3-sound-on.png',
    4: '/assets/elementos/outros/mundo4-sound-on.png',
    5: '/assets/elementos/outros/mundo5-sound-on.png',
  };

  iconsSoundOffByMundo: Record<number, string> = {
    1: '/assets/elementos/outros/sound-off.png',
    2: '/assets/elementos/outros/sound-off.png',
    3: '/assets/elementos/outros/sound-off.png',
    4: '/assets/elementos/outros/sound-off.png',
    5: '/assets/elementos/outros/sound-off.png',
  };

  imagemDesafioFundo = this.imagensDesafioMundos[1];
  mostrarErroResultado = false;
  mostrarModalRecompensas = false;
  recompensasGanhos: any[] = [];
  ouroGanho = 0;
  xpGanho = 0;

  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService,
    public audioService: AudioService,
    private jogadorService: JogadorService,
    private cdr: ChangeDetectorRef,
    private dicaService: DicaService
  ) {}
  
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.desafioId = Number(params.get('id'));

      this.resultColumns = [];
      this.resultRows = [];

      this.carregandoMundo = true;
      this.carregarMundo();
    });
  }

  carregarMundo(): void {
    this.getMundoIdByDesafio(this.desafioId).subscribe({
      next: mundoId => {

        if (mundoId === 6) {
          this.router.navigate(
            ['/capitulo/6', this.desafioId],
            { replaceUrl: true }
          );
          return;
        }

        this.mundoId = mundoId;

        this.imagemDesafioFundo =
          this.imagensDesafioMundos[this.mundoId] ??
          this.imagensDesafioMundos[1];

        this.carregarDesafio();

        this.carregandoMundo = false;
        this.cdr.detectChanges();
      },
      error: erro => {
        console.error('Erro ao carregar mundo:', erro);
        this.carregandoMundo = false;
      }
    });
  }
  
  carregarDesafio(): void {
    this.desafio = null;

    this.desafioService
      .buscarDesafio(this.desafioId)
      .subscribe({

        next: (desafio) => {

          this.desafio = desafio;
          this.carregarBlocos();

          this.cdr.detectChanges();
        },

        error: (erro) => {
          console.error('Erro ao carregar desafio:', erro);
        }
      });
  }

    getMundoIdByDesafio(desafioId: number): Observable<number> {
      return this.desafioService.buscarDesafio(desafioId).pipe(
        map((desafio) => desafio.capituloId),
        
        catchError((erro) => {
          console.error('Erro ao carregar desafio:', erro);
          return throwError(() => erro);
        })
      )
    }

  addBlock(block: BlocoDesafio): void {

    const index = this.availableBlocks.findIndex(
      b => b.id === block.id
    );

    if (index === -1) {
      return;
    }

    this.availableBlocks.splice(index, 1);

    this.queryBlocks.push(block);
  }


  montarQuery(): string {

    return this.queryBlocks
      .map(block => block.texto)
      .join(' ');
  }


  clearQuery(): void {

    this.queryBlocks = [];

    this.availableBlocks = [
      ...this.blocosIniciais
    ];
  }


  
  previewResult(): void {
    if (!this.desafio) {
      return;
    }

    if (this.queryBlocks.length === 0) {
      this.resultColumns = [];
      this.resultRows = [];
      this.animarErroResultado();
      return;
    }

    this.cdr.detectChanges();
    const sql = this.montarQuery();

    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {
      console.error('Nenhum jogador identificado.');
      this.router.navigate(['/']);
      return;
    }

    this.desafioService
      .previewSql(this.desafio.id, sql, jogadorId)
      .subscribe({

        next: (resposta) => {

          if (resposta.resultado) {
            if (resposta.resultado.colunas.length == 0 || resposta.resultado.linhas.length == 0) {
              this.animarErroResultado();
            }
            this.cdr.detectChanges();
          }

          if (resposta.resultado) {
            this.resultColumns = resposta.resultado.colunas;
            this.cdr.detectChanges();

            this.resultRows = resposta.resultado.linhas;
            this.cdr.detectChanges();
          }

          this.cdr.detectChanges();
        },

        error: (erro) => {
          console.error(
            'Erro ao executar SQL:',
            erro
          );
        }

      });

  }

  executeQuery(): void {

    if (!this.desafio) {
      return;
    }

    if (this.queryBlocks.length === 0) {
      this.resultColumns = [];
      this.resultRows = [];
      this.animarErroResultado();
      return;
    }
    

    this.cdr.detectChanges();
    const sql = this.montarQuery();

    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {
      console.error('Nenhum jogador identificado.');
      this.router.navigate(['/']);
      return;
    }

    this.desafioService
      .executarSql(this.desafio.id, sql, jogadorId)
      .subscribe({

        next: (resposta) => {

          if (resposta.resultado) {
            if (resposta.resultado.colunas.length == 0 || resposta.resultado.linhas.length == 0) {
              this.animarErroResultado();
            }
            this.cdr.detectChanges();
          }

          if (resposta.resultado) {
            this.resultColumns = resposta.resultado.colunas;
            this.cdr.detectChanges();

            this.resultRows = resposta.resultado.linhas;
            this.cdr.detectChanges();
          }

          this.cdr.detectChanges();

          if (!resposta.desafioConcluido) {
            this.animarErroResultado();
            this.erroConsultaSound();
            this.abrirErroConsulta(sql);
          }

          if (resposta.sucesso && resposta.desafioConcluido) {

            const recebeuRecompensa =
              resposta.xpGanho > 0 ||
              resposta.ouroGanho > 0 ||
              (resposta.itensRecebidos?.length ?? 0) > 0 ||
              (resposta.conquistasDesbloqueadas?.length ?? 0) > 0;

            if (recebeuRecompensa) {
              this.mensagemRecompensa = '';
              this.recompensaSound();
            } else {
              this.mensagemRecompensa = 'Desafio já concluído';
            }

            this.abrirModalRecompensas(resposta);
          }
        },

        error: (erro) => {

          console.error(
            'Erro ao executar SQL:',
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
      
  animarErroResultado(): void {
    this.mostrarErroResultado = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.mostrarErroResultado = false;
      this.cdr.detectChanges();
    }, 500);
  }

  carregarBlocos(): void {

    if (!this.desafio) {
      return;
    }

    this.desafioService
      .listarBlocosDesafio(this.desafio.id)
      .subscribe({
        next: (blocos) => {

          this.blocosIniciais = [...blocos];

          this.availableBlocks = [...blocos];

          this.queryBlocks = [];

          this.cdr.detectChanges();
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar blocos:',
            erro
          );
        }
      });
  }

  drop(event: CdkDragDrop<BlocoDesafio[]>): void {

    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  abrirModalRecompensas(resposta: any): void {

    const itens = resposta.itensRecebidos ?? [];
    const conquistas = resposta.conquistasDesbloqueadas ?? [];

    this.recompensasGanhos = itens.map((item: any) => ({
      id: item.ITEM_ID ?? item.itemId,
      nome: item.NOME ?? item.nome,
      descricao: item.DESCRICAO ?? item.descricao,
      image: this.normalizarImagem(item.IMAGEM ?? item.imagem),
      quantidade: item.QUANTIDADE ?? item.quantidade ?? 1
    }));

    this.conquistasGanhos = conquistas.map((conquista: any) => ({
      id: conquista.CONQUISTA_ID ?? conquista.conquistaId,
      nome: conquista.NOME ?? conquista.nome,
      descricao: conquista.DESCRICAO ?? conquista.descricao,
      image: this.normalizarImagem(conquista.IMAGEM ?? conquista.imagem)
    }));

    this.ouroGanho = resposta.ouroGanho ?? 0;
    this.xpGanho = resposta.xpGanho ?? 0;

    // Usa o ID do desafio atual como referência
    this.proximoDesafio = this.desafioId + 1;

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

  abrirErroConsulta(sql: string): void {
    console.error("ABrindo erro consulta");
    this.consultaComErro = sql;
    this.erroConsultaSound();
    this.mostrarErroConsulta = true;
  }

  tentarNovamente(): void {
    this.mostrarErroConsulta = false;
  }

  voltarDesafios(): void {
    this.router.navigate(['/desafios/capitulo', this.mundoId]);

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

}