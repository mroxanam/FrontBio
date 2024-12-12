import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './client.service';

describe('ClientService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ClienteService]
    
  });
  service = TestBed.inject(ClienteService);
  httpMock = TestBed.inject(HttpTestingController);

  
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch clients', () => {
    const mockClients = [{ nombre: 'Juan', dni: '12345678' }];
    service.getClients().subscribe((clients) => {
      expect(clients).toEqual(mockClients);
    });
    const req = httpMock.expectOne('http://localhost:5068/UsuarioAdministrador/Cliente');
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

});

export { ClienteService };
