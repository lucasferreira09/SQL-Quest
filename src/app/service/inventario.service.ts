
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ItemInventario,
  ConquistaInventario,
  DicasCompradas
} from '../inventario/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private readonly apiUrl = 'http://localhost:8080/api/inventario';

  constructor(private http: HttpClient) {}

  listar(jogadorId: number): Observable<ItemInventario[]> {

    const params = new HttpParams()
      .set('jogadorId', jogadorId);

    return this.http.get<ItemInventario[]>(this.apiUrl, { params });
  }

  listarConquistas(jogadorId: number): Observable<ConquistaInventario[]> {

    const params = new HttpParams()
      .set('jogadorId', jogadorId);

    return this.http.get<ConquistaInventario[]>(
      `${this.apiUrl}/conquistas`,
      { params }
    );
  }


  listarDicas(jogadorId: number): Observable<DicasCompradas[]> { // ADDED BY ME

    const params = new HttpParams()
      .set('jogadorId', jogadorId);

    return this.http.get<DicasCompradas[]>(
      `${this.apiUrl}/dicas`,
      { params }
    );
  }  
  
}
