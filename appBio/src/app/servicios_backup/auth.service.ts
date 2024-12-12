import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5068/Auth/login';
  private userRoleSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  public userRole$ = this.userRoleSubject.asObservable();
  public username$ = this.usernameSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedInfo = JSON.parse(userInfo);
          this.userRoleSubject.next(parsedInfo.rol || '');
          this.usernameSubject.next(parsedInfo.username || '');
        } catch (error) {
          console.error('Error parsing userInfo:', error);
        }
      }
    }
  }

  login(loginData: any): Observable<any> {
    return this.http.post(this.apiUrl, loginData).pipe(
      tap((response: any) => {
        console.log('Respuesta del servidor en auth.service:', response);
        if (response.success && this.isBrowser) {
          // Guardamos el nombre de usuario del formulario
          const userInfo = {
            username: loginData.username, // Usamos el username del formulario
            rol: response.rol
          };
          console.log('Guardando en localStorage:', userInfo);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          this.userRoleSubject.next(response.rol);
          this.usernameSubject.next(loginData.username);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userInfo');
    }
    this.userRoleSubject.next('');
    this.usernameSubject.next('');
  }

  getUserInfo(): { username: string, role: string } {
    if (this.isBrowser) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedInfo = JSON.parse(userInfo);
          return {
            username: parsedInfo.username || '',
            role: parsedInfo.rol || ''
          };
        } catch (error) {
          console.error('Error parsing userInfo:', error);
        }
      }
    }
    return { username: '', role: '' };
  }
}
