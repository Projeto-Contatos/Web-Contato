import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = 'http://localhost:8080/contato';

  constructor(private http: HttpClient) { }

  criarContato(contatoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, contatoData);
  }

  listarContatos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  favoritarContato(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/favorito/${id}`, {});
  }

  toggleAtivo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/ativo/${id}`, {});
  }

  atualizarContato(id: number, contatoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, contatoData);
  }

  buscarPorCelular(celular: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${celular}`);
  }
}