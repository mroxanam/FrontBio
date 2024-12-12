import { TestBed } from '@angular/core/testing';
import { FacturaService } from './factura.service'; // Asegúrate de que la ruta sea correcta

describe('FacturaService', () => {
  let service: FacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacturaService]
    });
    service = TestBed.inject(FacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
