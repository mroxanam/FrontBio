import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl; // URL base de la API
  private roleSubject = new BehaviorSubject<string>(''); // Sujeto para cambios de rol
  private usernameSubject = new BehaviorSubject<string>(''); // Sujeto para cambios de nombre de usuario

  userRole$ = this.roleSubject.asObservable(); // Observable para suscripción de roles
  username$ = this.usernameSubject.asObservable(); // Observable para suscripción de nombres de usuario

  constructor(private http: HttpClient) {}

  /**
   * Obtiene información del usuario almacenada en el localStorage.
   */
  getUserInfo(): { role: string; username: string; dni: string } {
    try {
      const userInfo = {
        role: localStorage.getItem('userRole') || '',
        username: localStorage.getItem('username') || '',
        dni: localStorage.getItem('dni') || '', // Incluye el DNI
      };

      this.roleSubject.next(userInfo.role); // Actualiza el BehaviorSubject
      this.usernameSubject.next(userInfo.username); // Actualiza el BehaviorSubject

      return userInfo;
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      return { role: '', username: '', dni: '' };
    }
  }

  /**
   * Actualiza las credenciales del usuario autenticado.
   * @param credenciales Contiene el nuevo usuario, contraseña actual y nueva contraseña.
   * @returns Observable del resultado de la petición.
   */
  actualizarCredenciales(credenciales: {
    nuevoUsername: string;
    nuevaPassword: string;
    passwordActual: string;
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/Auth/actualizar-credenciales`;

    const requestBody = {
      NuevoUsername: credenciales.nuevoUsername,
      NuevaPassword: credenciales.nuevaPassword,
      PasswordActual: credenciales.passwordActual,
    };

    console.log('URL de la petición:', endpoint);
    console.log('Datos enviados:', requestBody);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.put(endpoint, requestBody, {
      headers,
      withCredentials: true, // Importante para cookies de sesión
    });
  }

  /**
   * Invalida la sesión del usuario actual.
   */
  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('dni'); // Limpia el DNI del almacenamiento
    this.roleSubject.next('');
    this.usernameSubject.next('');
  }
}
