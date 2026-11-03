import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Buscar dicas de um desafio
  listarDicas(desafioId: number): Observable<Dica[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/desafio/${desafioId}`
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
    return this.http.get<{ ouro: number }>(
      `${this.apiUrl}/ouro`
    );
  }

  // Comprar uma dica
  comprarDica(dicaId: number): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/comprar`,
      { dicaId }
    );
  }
}