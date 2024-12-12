import { HttpHeaders } from '@angular/common/http';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5068',
  frontendUrl: 'http://localhost:4200'
};

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

// Opciones HTTP cuando necesitamos enviar credenciales
export const httpOptionsWithCredentials = {
  ...httpOptions,
  withCredentials: true
};
