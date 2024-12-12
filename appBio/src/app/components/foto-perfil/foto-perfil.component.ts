import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FotoPerfilService } from '../../servicios/foto-perfil.service';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="foto-perfil-container" (click)="triggerFileInput()">
      <input
        type="file"
        #fileInput
        (change)="onFileSelected($event)"
        accept="image/jpeg,image/png,image/gif"
        style="display: none"
      >
      <img
        [src]="fotoUrl || 'assets/default-avatar.png'"
        alt="Foto de perfil"
        class="foto-perfil"
      >
      <div class="overlay">
        <span>Cambiar foto</span>
      </div>
    </div>
  `,
  styles: [`
    .foto-perfil-container {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      margin-left: 45px;
      margin-top: -8px;
    }

    .foto-perfil {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .overlay span {
      color: white;
      font-size: 14px;
    }

    .foto-perfil-container:hover .overlay {
      opacity: 1;
    }
  `]
})
export class FotoPerfilComponent implements OnInit {
  fotoUrl: string | null = null;

  constructor(
    private fotoPerfilService: FotoPerfilService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarFotoPerfil();
  }

  cargarFotoPerfil() {
    this.fotoPerfilService.obtenerFotoPerfil().subscribe({
      next: (blob) => {
        this.fotoUrl = URL.createObjectURL(blob);
      },
      error: (error) => {
        console.error('Error al cargar la foto de perfil:', error);
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Solo se permiten archivos JPG, PNG o GIF', 'Cerrar', {
          duration: 3000
        });
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('La imagen no debe superar los 5MB', 'Cerrar', {
          duration: 3000
        });
        return;
      }

      // Subir foto
      this.fotoPerfilService.subirFotoPerfil(file).subscribe({
        next: (response) => {
          this.snackBar.open('Foto de perfil actualizada correctamente', 'Cerrar', {
            duration: 3000
          });
          this.cargarFotoPerfil(); // Recargar la foto
        },
        error: (error) => {
          this.snackBar.open('Error al subir la foto: ' + (error.error?.mensaje || 'Error desconocido'), 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }
}
