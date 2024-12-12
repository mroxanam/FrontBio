import { Component } from '@angular/core';
import { VentanaEmergenteService } from '../servicios/ventana-emergente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;  
  errorMessage: string = '';  
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder, 
    public ventanaEmergenteService: VentanaEmergenteService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }) as FormGroup; 
  }

  abrirVentanaEmergentePassword() {
    this.ventanaEmergenteService.abrirVentanaEmergente();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const username = this.loginForm.get('username')?.value?.trim();
      const password = this.loginForm.get('password')?.value?.trim();

      if (!username || !password) {
        this.error = 'Por favor, complete todos los campos.';
        this.loading = false;
        return;
      }

      const loginData = {
        username: username,
        password: password
      };

      console.log('Enviando datos de login:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta de login:', response);
          
          if (!response.usuario && !response.username) {
            this.error = 'Error en la respuesta del servidor';
            this.loading = false;
            return;
          }

          // Verificar que la información se guardó correctamente
          const userInfo = this.authService.getUserInfo();
          if (!userInfo.username || !userInfo.rol) {
            this.error = 'Error al guardar la información del usuario';
            this.loading = false;
            return;
          }

          console.log('Login exitoso. UserInfo:', userInfo);
          this.router.navigate(['/dash']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          if (error instanceof Error) {
            this.error = error.message;
          } else {
            this.error = error.error?.mensaje || error.error?.message || 'Error al iniciar sesión';
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      console.log('Formulario inválido');
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
