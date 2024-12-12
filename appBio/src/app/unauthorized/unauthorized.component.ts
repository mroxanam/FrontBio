import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="error-template">
            <h1>403 - Acceso Denegado</h1>
            <div class="error-details my-3">
              Lo sentimos, no tienes permiso para acceder a esta página.
            </div>
            <div class="error-info my-3">
              Usuario actual: {{ userInfo?.username || 'No identificado' }}<br>
              Rol: {{ userInfo?.role || 'Sin rol asignado' }}
            </div>
            <div class="error-actions">
              <button class="btn btn-primary btn-lg me-2" (click)="goBack()">
                Volver
              </button>
              <button class="btn btn-secondary btn-lg" (click)="logout()">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-template {
      padding: 40px 15px;
      text-align: center;
    }
    .error-actions {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  `]
})
export class UnauthorizedComponent {
  userInfo: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
  }

  goBack() {
    window.history.back();
  }

  logout() {
    this.authService.logout();
  }
}
