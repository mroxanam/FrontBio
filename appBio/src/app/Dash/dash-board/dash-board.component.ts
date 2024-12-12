import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FotoPerfilComponent } from '../../components/foto-perfil/foto-perfil.component';
import { CambiarCredencialesComponent } from '../../components/cambiar-credenciales/cambiar-credenciales.component';
import { MENU_ITEMS } from '../../config/menu-items.config';
import { ClienteService } from '../../services/client.service';


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, FotoPerfilComponent],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, OnDestroy {
  userRol: string | null = '';
  username: string | null = '';
  menuItems: any[] = [];
  clients: any[] = [];
  private isBrowser: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private clientService: ClienteService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const userInfo = this.authService.getUserInfo();
    this.userRol = userInfo.rol || '';
    this.username = userInfo.username || '';

    this.updateMenuItems(this.userRol);

    if (this.userRol === 'Cliente') {
      this.loadClientData();
    } else {
      this.loadAllClients();
    }

    this.subscriptions.push(
      this.authService.userRole$.subscribe(rol => {
        this.userRol = rol;
        this.updateMenuItems(rol);
      })
    );

    this.subscriptions.push(
      this.authService.username$.subscribe(username => {
        this.username = username;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateMenuItems(userRol: string | null) {
    if (!userRol) {
      this.menuItems = [];
      return;
    }

    this.menuItems = MENU_ITEMS.filter(item => item.roles.includes(userRol));
  }

  private loadClientData() {
   // Asegúrate de convertir el DNI a un número
const dni = Number(this.authService.getUserInfo().dni);

if (!isNaN(dni)) {
  this.clientService.getClientByDni(dni).subscribe({
    next: (data) => {
      console.log('Cliente cargado:', data);
    },
    error: (error) => {
      console.error('Error al cargar cliente:', error);
    }
  });
} else {
  console.error('DNI no válido');
}

    };
  
  private loadAllClients() {
    this.clientService.getClients().subscribe({
      next: (data: any[]) => {
        console.log('Clientes recibidos:', data); // Verifica que los datos lleguen correctamente
        this.clients = data; // Asigna la lista de clientes al array `clients`
      },
      error: (err) => {
        console.error('Error al cargar la lista de clientes:', err);
        this.clients = []; // Vacía la lista en caso de error
      }
    });
  }
  
    abrirModalCredenciales() {
    const dialogRef = this.dialog.open(CambiarCredencialesComponent, {
      width: '400px',
      disableClose: true
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe({
        next: result => {
          if (result) console.log('Credenciales actualizadas con éxito');
        },
        error: err => console.error('Error al cerrar el diálogo:', err)
      })
    );
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => {
        console.error('Error during logout:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
