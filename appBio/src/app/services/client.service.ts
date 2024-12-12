import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Asegúrate de que el servicio esté disponible en toda la aplicación
})
export class ClienteService {
  private apiUrl = 'http://localhost:5068/UsuarioAdministrador/Cliente';  // Asegúrate de que esta URL sea la correcta

  constructor(private http: HttpClient) {}

  // Método para obtener todos los clientes
  getClients(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token desde el almacenamiento local
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Configura el encabezado con el token
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error al cargar clientes:', error);  // Registra el error en la consola
        return throwError(() => new Error('Error al cargar los clientes'));  // Lanza un error
      })
    );
  }

  // Método para obtener un cliente por DNI
  getClientByDni(dni: number): Observable<any> {
    const url = `${this.apiUrl}/dni/${dni}`; // Forma la URL con el DNI
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error al cargar cliente por DNI:', error);  // Registra el error en la consola
        return throwError(() => new Error('Error al cargar el cliente'));  // Lanza un error
      })
    );
  }

  // Método para seleccionar un cliente
  seleccionarCliente(cliente: any): void {
    // Aquí puedes guardar el cliente seleccionado o realizar alguna otra acción
    console.log('Cliente seleccionado:', cliente);  // Muestra el cliente seleccionado en la consola
  }
}
