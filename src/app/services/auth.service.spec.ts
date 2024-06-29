import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage-angular';
import { AuthService, AuthResponse } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Storage', ['create', 'set', 'get', 'remove']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Storage, useValue: spy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    // Crear un objeto de almacenamiento falso
    const fakeStorage = new Storage();
    storageSpy.create.and.returnValue(Promise.resolve(fakeStorage));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store tokens on login', (done) => {
    const mockResponse: AuthResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
      };
    const credentials = { CT_Correo: 'usuario@ucr.ac.cr', CT_Contrasena: '1111' };

    storageSpy.set.and.returnValue(Promise.resolve());

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);

      // Esperar a que las llamadas async se completen
      setTimeout(() => {
        expect(storageSpy.set.calls.allArgs()).toEqual([
          [service['accessTokenKey'], mockResponse.accessToken],
          [service['refreshTokenKey'], mockResponse.refreshToken]
        ]);

        done();
      }, 0);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });



  it('should get access token', async () => {
    const token = 'access-token';
    storageSpy.get.and.returnValue(Promise.resolve(token));

    const accessToken = await service.getAccessToken();
    expect(accessToken).toBe(token);
  });

  it('should get refresh token', async () => {
    const token = 'refresh-token';
    storageSpy.get.and.returnValue(Promise.resolve(token));

    const refreshToken = await service.getRefreshToken();
    expect(refreshToken).toBe(token);
  });

  it('should refresh access token', (done) => {
    const mockResponse: AuthResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'refresh-token'
    };
    const refreshToken = 'refresh-token';

    storageSpy.set.and.returnValue(Promise.resolve());

    service.refreshAccessToken(refreshToken).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(storageSpy.set).toHaveBeenCalledWith(service['accessTokenKey'], mockResponse.accessToken);
      done();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/token`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout', async () => {
    storageSpy.remove.and.returnValue(Promise.resolve());

    await service.logout();
    expect(storageSpy.remove).toHaveBeenCalledWith(service['accessTokenKey']);
    expect(storageSpy.remove).toHaveBeenCalledWith(service['refreshTokenKey']);
  });

  it('should decode token', () => {
    const token = 'header.payload.signature';
    const payload = { userId: '2' };
    const base64Payload = btoa(JSON.stringify(payload));
    const tokenWithPayload = `header.${base64Payload}.signature`;

    const decoded = service.decodeToken(tokenWithPayload);
    expect(decoded).toEqual(payload);
  });

  it('should handle errors', () => {
    spyOn(console, 'error');
    const error = { message: 'Error' };
    service['handleError'](error);
    expect(console.error).toHaveBeenCalledWith('Error during authentication:', error);
  });
});

