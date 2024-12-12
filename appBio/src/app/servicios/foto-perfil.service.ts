import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoPerfilService {
  private apiUrl = 'http://localhost:5068/api/FotoPerfil';

  constructor(private http: HttpClient) { }

  subirFotoPerfil(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', archivo);

    const options = {
      withCredentials: true
    };

    return this.http.post(`${this.apiUrl}/subir`, formData, options);
  }

  obtenerFotoPerfil(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/obtener`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
