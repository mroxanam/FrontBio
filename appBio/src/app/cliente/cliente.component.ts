import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/client.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  standalone: true, // El componente es standalone
  imports: [CommonModule] // Añade CommonModule aquí
})
export class ClienteComponent implements OnInit {
  clients: any[] = [];  // Asegúrate de que sea un array vacío inicialmente
  selectedClient: any = null;
  userRole: string = '';  // Para almacenar el rol del usuario

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || ''; // Obtener el rol desde el almacenamiento local
  
    if (this.userRole === 'Cliente') {
      const dni = localStorage.getItem('dni'); // Asumo que el DNI se guarda en el almacenamiento local
      if (dni) {
        const dniNumber = parseInt(dni, 10); // Convertir el DNI a número
        if (!isNaN(dniNumber)) {
          this.loadClientByDni(dniNumber); // Usamos el DNI convertido como número
        } else {
          console.error('El DNI no es válido:', dni);
        }
      } else {
        console.error('DNI no encontrado en localStorage');
      }
    } else {
      this.loadClients(); // Cargar todos los clientes si no es un cliente específico
    }
  }

  // Método para cargar todos los clientes (para Manager, Administrador, Técnico)
  loadClients(): void {
    this.clienteService.getClients().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clients = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  // Método para cargar un cliente específico por DNI (para Cliente)
  loadClientByDni(dni: number): void {
    this.clienteService.getClientByDni(dni).subscribe({
      next: (data) => {
        console.log('Cliente recibido:', data);
        this.clients = [data]; // Solo se carga el cliente correspondiente
      },
      error: (err) => {
        console.error('Error al cargar cliente por DNI:', err);
      },
    });
  }

  // Método para seleccionar un cliente
  selectClient(client: any): void {
    this.selectedClient = client;
    console.log('Cliente seleccionado:', client);
  }
}
