import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="container-fluid">
      <div class="row page-titles">
        <div class="col-md-5 align-self-center">
          <h4 class="text-themecolor">Configuración del Sistema</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Configuraciones</h4>
              <p>Esta sección está en desarrollo. Aquí podrás configurar los parámetros del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {}
