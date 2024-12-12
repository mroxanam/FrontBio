import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ClienteComponent } from './cliente.component';
import { ClienteService } from '../services/client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ClienteComponent', () => {
  let component: ClienteComponent;
  let fixture: ComponentFixture<ClienteComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ClienteService', ['getClients', 'seleccionarCliente']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClienteComponent], // Importamos el componente standalone
      providers: [{ provide: ClienteService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
  });

  it('should load clients on initialization', () => {
    const mockClients = [{ nombre: 'Pedro', apellido: 'Gomez', dni: '12345678' }];
    clienteServiceSpy.getClients.and.returnValue(of(mockClients));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.clients).toEqual(mockClients);
  });

  it('should handle errors while loading clients', () => {
    clienteServiceSpy.getClients.and.returnValue(throwError(() => new Error('Error loading clients')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(clienteServiceSpy.getClients).toHaveBeenCalled();
    expect(component.clients).toEqual([]); // Se asegura de que no haya clientes cargados al fallar
  });

  it('should select a client', () => {
    const mockClient = { nombre: 'Pedro', apellido: 'Gomez', dni: '12345678' };

    component.selectClient(mockClient);

    expect(component.selectedClient).toEqual(mockClient);
    expect(clienteServiceSpy.seleccionarCliente).toHaveBeenCalledWith(mockClient);
  });
});
