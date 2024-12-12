import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5068/Auth';
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const userInfo = this.getUserInfo();
      if (userInfo.rol) {
        this.userRoleSubject.next(userInfo.rol);
      }
      if (userInfo.username) {
        this.usernameSubject.next(userInfo.username);
      }
    }
  }

  login(loginData: any): Observable<any> {
    console.log('Intentando login con datos:', loginData);
    
    // Asegurarnos de que los datos estén en el formato correcto
    const username = loginData.username?.trim();
    const password = loginData.password?.trim();

    if (!username || !password) {
      return throwError(() => new Error('Usuario y contraseña son requeridos'));
    }

    // Convertir los nombres de las propiedades para que coincidan con el backend
    const requestBody = {
      username: username,  
      password: password
    };

    console.log('Enviando al servidor:', requestBody);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.post(`${this.apiUrl}/login`, requestBody, options).pipe(
      tap((response: any) => {
        console.log('Respuesta del servidor en auth.service:', response);
        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }

        // Verificar si la respuesta tiene el formato esperado
        const usuario = response.usuario || response.username;
        const rol = response.rol || response.role;

        if (!usuario || !rol) {
          console.error('Respuesta del servidor incompleta:', response);
          throw new Error('Respuesta del servidor incompleta');
        }

        const userInfo = {
          username: usuario,
          rol: rol
        };

        if (this.isBrowser) {
          console.log('Guardando en localStorage:', userInfo);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          this.userRoleSubject.next(rol);
          this.usernameSubject.next(usuario);
        }
      }),
      catchError(error => {
        console.error('=== Error en login ===');
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('URL:', error.url);
        console.error('Error completo:', error);
        console.error('Datos enviados:', requestBody);
        
        let errorMessage = 'Error al intentar iniciar sesión';
        
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Credenciales inválidas';
        } else if (error.status === 401) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor';
        }

        console.error('Mensaje de error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.post(`${this.apiUrl}/logout`, {}, options).pipe(
      tap(() => {
        if (this.isBrowser) {
          localStorage.removeItem('userInfo');
          this.userRoleSubject.next(null);
          this.usernameSubject.next(null);
        }
      }),
      catchError(error => {
        console.error('Error en logout:', error);
        return throwError(() => error);
      })
    );
  }
    getUserInfo(): { dni: string | null; role: string; username: string | null; rol: string | null } {
  if (!this.isBrowser) {
    return { username: null, rol: null, role: '', dni: null };
  }

  const userInfoStr = localStorage.getItem('userInfo');
  console.log('UserInfo en localStorage:', userInfoStr);

  if (!userInfoStr) {
    return { username: null, rol: null, role: '', dni: null };
  }

  try {
    const userInfo = JSON.parse(userInfoStr);
    console.log('UserInfo parseado:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('Error al parsear userInfo:', error);
    return { username: null, rol: null, role: '', dni: null };
  }
}

  

    
  

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const userInfo = this.getUserInfo();
    return !!(userInfo.username && userInfo.rol);
  }

  actualizarCredenciales(credenciales: {
    nuevoUsername: string,
    nuevaPassword: string,
    passwordActual: string
  }): Observable<any> {
    if (!this.isAuthenticated()) {
      console.log('No autenticado');
      return throwError(() => new Error('No hay sesión activa'));
    }

    const userInfo = this.getUserInfo();
    console.log('Información del usuario antes de actualizar:', userInfo);

    const endpoint = `${this.apiUrl}/actualizar-credenciales`;
    
    const requestBody = {
      NuevoUsername: credenciales.nuevoUsername,
      NuevaPassword: credenciales.nuevaPassword,
      PasswordActual: credenciales.passwordActual
    };

    console.log('URL de la petición:', endpoint);
    console.log('Método HTTP:', 'PUT');
    console.log('Datos enviados:', JSON.stringify(requestBody, null, 2));

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.put<any>(endpoint, requestBody, options).pipe(
      tap(response => {
        console.log('Respuesta cruda del servidor:', response);
        // Si la respuesta es un string, convertirla a objeto
        if (typeof response === 'string') {
          return {
            success: true,
            mensaje: response
          };
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en actualizarCredenciales:', error);
        if (error.status === 200) {
          // Si el status es 200 pero llegó al catch, probablemente es una respuesta exitosa mal formateada
          return of({ success: true, mensaje: 'Credenciales actualizadas correctamente' });
        }
        return throwError(() => error);
      })
    );
  }

  updateUserInfo(userInfo: { username: string; rol: string }) {
    if (this.isBrowser) {
      localStorage.setItem('username', userInfo.username);
      localStorage.setItem('rol', userInfo.rol);
      this.userRoleSubject.next(userInfo.rol);
      this.usernameSubject.next(userInfo.username);
    }
  }

  hasRole(allowedRoles: string[]): boolean {
    const userInfo = this.getUserInfo();
    return userInfo.rol !== null && allowedRoles.includes(userInfo.rol);
  }
}
