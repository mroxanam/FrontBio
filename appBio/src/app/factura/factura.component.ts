import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturaService } from '../services/factura.service'; // Ruta corregida
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {
  facturaForm!: FormGroup; // Formulario para crear factura
  facturaSeleccionada: any = null; // Factura seleccionada o cargada

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      consumoMensual: ['', Validators.required],
      consumoTotal: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
    });

    // Opcional: Cargar una factura al inicializar el componente
    this.cargarFactura(1); // Cambia el ID según lo necesites
  }

  cargarFactura(id: number): void {
    this.facturaService.obtenerFacturaPorId(id).subscribe({
      next: (factura) => {
        this.facturaSeleccionada = factura;
        console.log('Factura cargada:', this.facturaSeleccionada);
      },
      error: (err) => {
        console.error('Error al cargar la factura:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.facturaForm.valid) {
      const facturaData = this.facturaForm.value;

      const userInfo = this.authService.getUserInfo();
      const dniCliente = userInfo?.dni;

      if (!dniCliente) {
        alert('No se pudo obtener el DNI del cliente. Verifique la autenticación.');
        return;
      }

      this.facturaService.crearFactura({ ...facturaData, clienteDni: dniCliente }).subscribe({
        next: (response: any) => {
          console.log('Factura cargada:', response);
          alert('Factura cargada exitosamente');
        },
        error: (error: any) => {
          console.error('Error al cargar factura:', error);
          alert('Hubo un error al cargar la factura');
        },
      });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
