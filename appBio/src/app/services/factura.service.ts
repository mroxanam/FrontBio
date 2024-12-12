import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = 'http://localhost:5068/api/Facturas';

  constructor(private http: HttpClient) {}

  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }

  obtenerFacturaPorId(numeroFactura: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${numeroFactura}`);
  }

  obtenerFacturasPorCliente(dni: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${dni}`);
  }
}
