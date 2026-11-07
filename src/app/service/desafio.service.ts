import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ItemRecebido {
  ITEM_ID?: number;
  NOME?: string;
  DESCRICAO?: string;
  IMAGEM?: string;
  QUANTIDADE?: number;

  // Alternativas caso o backend retorne camelCase
  itemId?: number;
  nome?: string;
  descricao?: string;
  imagem?: string;
  quantidade?: number;
}

export interface ConquistaDesbloqueada {
  CONQUISTA_ID?: number;
  NOME?: string;
  DESCRICAO?: string;
  IMAGEM?: string;

  // Alternativas caso o backend retorne camelCase
  conquistaId?: number;
  nome?: string;
  descricao?: string;
  imagem?: string;
}

export interface ExecutarSqlResponse {
  sucesso: boolean;
  desafioConcluido: boolean;
  mensagem: string;
  xpGanho: number;
  ouroGanho: number;
  resultado: ResultadoSql | null;

  itensRecebidos: ItemRecebido[];
  conquistasDesbloqueadas: ConquistaDesbloqueada[];
}


export interface BlocoDesafio {
  id: number;
  desafioId: number;
  ordem: number;
  texto: string;
}

export interface ResultadoSql {
  colunas: string[];
  linhas: any[][];
}

export interface ExecutarSqlResponse {
  sucesso: boolean;
  desafioConcluido: boolean;
  mensagem: string;
  xpGanho: number;
  ouroGanho: number;
  resultado: ResultadoSql | null;
}

export interface PreviewSqlResponse {
  mensagem: string;
  resultado: ResultadoSql | null;
}

export interface Desafio {
  id: number;
  capituloId: number;
  ordem: number;
  titulo: string;
  descricao: string;
  objetivo: string;
  dificuldade: number;
  conceitoSql: string;
  xp: number;
  ouro: number;
}

export interface Capitulo {
  id: number;
  numero: number;
  nome: string;
  descricao: string;
  conceitoPrincipal: string;
  recompensa: string;
}

@Injectable({providedIn: 'root'})
export class DesafioService {

  private apiUrl = 'https://sql-quest-backend.onrender.com'

  constructor(private http: HttpClient) {}

  executarSql(desafioId: number, sql: string, jogadorId: number): Observable<ExecutarSqlResponse> {

    return this.http.post<ExecutarSqlResponse>(`${this.apiUrl}/api/desafios/${desafioId}/executar`, { sql, jogadorId });
  }

  previewSql(desafioId: number, sql: string, jogadorId: number): Observable<PreviewSqlResponse> {

    return this.http.post<PreviewSqlResponse>(`${this.apiUrl}/api/desafios/${desafioId}/preview`, { sql, jogadorId });
  }

  listarCapitulos(): Observable<Capitulo[]> {
    
    return this.http.get<Capitulo[]>(`${this.apiUrl}/api/capitulos`);
  }

  listarDesafiosPorCapitulo(capituloId: number): Observable<Desafio[]> {

    return this.http.get<Desafio[]>(`${this.apiUrl}/api/desafios/capitulo/${capituloId}`);
  }

  buscarDesafiosConcluidos(
    jogadorId: number
  ): Observable<number[]> {

    return this.http.get<number[]>(
      `${this.apiUrl}/api/progresso/jogador/${jogadorId}`
    );
  }

  buscarDesafio(id: number): Observable<Desafio> {

    return this.http.get<Desafio>(
      `${this.apiUrl}/api/desafios/${id}`
    );
  }

  listarBlocosDesafio(
    desafioId: number
  ): Observable<BlocoDesafio[]> {

    return this.http.get<BlocoDesafio[]>(
      `${this.apiUrl}/api/desafios/${desafioId}/blocos`
    );
  }
}