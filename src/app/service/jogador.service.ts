
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Jogador {
  id: number;
  nome: string;
  xp: number;
  ouro: number;
  nivel: number;
  criadoEm: string;
}

@Injectable({
  providedIn: 'root'
})
export class JogadorService {

  //private readonly apiUrl = 'http://localhost:8080/api/jogadores';
  private readonly storageKey = 'sqlquest_jogador';
  private apiUrl = 'https://sql-quest-backend.onrender.com'

  constructor(private http: HttpClient) {}

  entrar(nome: string): Observable<Jogador> {

    return this.http.post<Jogador>(
      `${this.apiUrl}/api/jogadores/entrar`,
      { nome }
    ).pipe(
      tap(jogador => {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify(jogador)
        );
      })
    );
  }

  obterJogador(): Jogador | null {

    const dados = localStorage.getItem(this.storageKey);

    if (!dados) {
      return null;
    }

    try {
      return JSON.parse(dados) as Jogador;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  obterId(): number | null {
    return this.obterJogador()?.id ?? null;
  }

  sair(): void {
    localStorage.removeItem(this.storageKey);
  }
}
