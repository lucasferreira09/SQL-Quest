
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { JogadorService } from './jogador.service';

export interface Dica {
  id: number;
  desafioId: number;
  nivel: number;
  texto: string;
  custoOuro: number;
  comprada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DicaService {

  private apiUrl = 'http://localhost:8080/api/dicas';

  constructor(
    private http: HttpClient,
    private jogadorService: JogadorService
  ) {}

  // Obter ID do jogador atual
  private obterJogadorId(): number {
    const jogadorId = this.jogadorService.obterId();

    if (jogadorId === null) {
      throw new Error('Nenhum jogador identificado.');
    }

    return jogadorId;
  }

  // Buscar dicas de um desafio
  listarDicas(desafioId: number): Observable<Dica[]> {

    const params = new HttpParams()
      .set('jogadorId', this.obterJogadorId());

    return this.http.get<any[]>(
      `${this.apiUrl}/desafio/${desafioId}`,
      { params }
    ).pipe(
      map(dicas => dicas.map(dica => ({
        id: dica.ID ?? dica.id,
        desafioId: dica.DESAFIO_ID ?? dica.desafioId,
        nivel: dica.NIVEL ?? dica.nivel,
        texto: dica.TEXTO ?? dica.texto,
        custoOuro: dica.CUSTO_OURO ?? dica.custoOuro,
        comprada: dica.COMPRADA ?? dica.comprada
      })))
    );
  }

  // Consultar saldo de ouro
  buscarSaldoJogador(): Observable<{ ouro: number }> {

    const params = new HttpParams()
      .set('jogadorId', this.obterJogadorId());

    return this.http.get<{ ouro: number }>(
      `${this.apiUrl}/ouro`,
      { params }
    );
  }

  // Comprar uma dica
  comprarDica(dicaId: number): Observable<any> {

    const jogadorId = this.obterJogadorId();

    return this.http.post<any>(
      `${this.apiUrl}/comprar`,
      { dicaId, jogadorId }
    );
  }
}
