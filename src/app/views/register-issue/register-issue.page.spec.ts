import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegisterIssuePage } from './register-issue.page';
import { CameraService } from '../../helpers/camera.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../helpers/notification.service';
import { EmailService } from '../../services/email.service';
import { LoadingService } from '../../helpers/loading.service';
import { LogsService } from 'src/app/services/logs.service';

describe('RegisterIssuePage', () => {
  let component: RegisterIssuePage;
  let fixture: ComponentFixture<RegisterIssuePage>;
  let cameraServiceSpy: jasmine.SpyObj<CameraService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let logsServiceSpy: jasmine.SpyObj<LogsService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const cameraSpy = jasmine.createSpyObj('CameraService', ['tomarFoto', 'subirFoto']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getApiUrl', 'getAccessToken', 'decodeToken', 'getUserFromToken']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['presentToast']);
    const emailSpy = jasmine.createSpyObj('EmailService', ['sendEmail']);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['presentLoading', 'dismissLoading']);
    const logsSpy = jasmine.createSpyObj('LogsService', ['saveGeneralLog']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [RegisterIssuePage],
      providers: [
        FormBuilder,
        { provide: CameraService, useValue: cameraSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: EmailService, useValue: emailSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: LogsService, useValue: logsSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterIssuePage);
    component = fixture.componentInstance;
    cameraServiceSpy = TestBed.inject(CameraService) as jasmine.SpyObj<CameraService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    emailServiceSpy = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    logsServiceSpy = TestBed.inject(LogsService) as jasmine.SpyObj<LogsService>;
    httpMock = TestBed.inject(HttpTestingController);

    // Configurar spies para métodos
    authServiceSpy.getApiUrl.and.returnValue('http://localhost:3000/api');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form and photos', () => {
    component.photos = ['photo1', 'photo2'];
    component.reset();
    expect(component.registroForm.pristine).toBeTrue();
    expect(component.photos.length).toBe(0);
  });

  it('should load generated incidents on ngOnInit', () => {
    const mockIncidents = [{ id: 1, title: 'Test Incident' }];
    authServiceSpy.getUserFromToken.and.returnValue(Promise.resolve({ CN_ID_Usuario: 1 }));
    spyOn(component, 'loadIncidenciasGeneradas').and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.loadIncidenciasGeneradas).toHaveBeenCalled();
    const req = httpMock.expectOne('http://localhost:3000/api/incidents/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidents);
    expect(component.incidencias).toEqual(mockIncidents);
  });

  it('should handle form submission when form is valid', async () => {
    const mockToken = 'mock-token';
    const decodedToken = { CN_ID_Usuario: 1 };
    const mockIncidentResponse = { data: { CN_ID_Incidente: 1 } };

    component.registroForm.setValue({
      CT_Titulo_Incidencia: 'Test Title',
      CT_Descripcion_Incidencia: 'Test Description',
      CT_Lugar_Incidencia: 'Test Location'
    });

    authServiceSpy.getAccessToken.and.returnValue(Promise.resolve(mockToken));
    authServiceSpy.decodeToken.and.returnValue(decodedToken);
    spyOn(component, 'reset').and.callThrough();
    spyOn(component, 'loadIncidenciasGeneradas').and.callThrough();

    const submitPromise = component.onSubmit();
    await expectAsync(submitPromise).toBeResolved();

    const incidentReq = httpMock.expectOne('http://localhost:3000/api/incidents');
    expect(incidentReq.request.method).toBe('POST');
    incidentReq.flush(mockIncidentResponse);

    expect(component.reset).toHaveBeenCalled();
    expect(component.loadIncidenciasGeneradas).toHaveBeenCalled();
    expect(notificationServiceSpy.presentToast).toHaveBeenCalledWith('Incidencia registrada correctamente.', 'success');
  });

  it('should handle form submission when form is invalid', async () => {
    component.registroForm.setValue({
      CT_Titulo_Incidencia: '',
      CT_Descripcion_Incidencia: '',
      CT_Lugar_Incidencia: ''
    });

    spyOn(component, 'reset').and.callThrough();

    const submitPromise = component.onSubmit();
    await expectAsync(submitPromise).toBeResolved();

    expect(notificationServiceSpy.presentToast).toHaveBeenCalledWith('ERROR: Formulario incompleto, por favor, completa todos los campos requeridos', 'warning');
    expect(component.reset).not.toHaveBeenCalled();
  });

  it('should take a photo', async () => {
    const mockPhoto = 'data:image/jpeg;base64,...';
    cameraServiceSpy.tomarFoto.and.returnValue(Promise.resolve(mockPhoto));

    await component.tomarFoto();

    expect(component.photos.length).toBe(1);
    expect(component.photos[0]).toBe(mockPhoto);
  });

  it('should upload a photo', async () => {
    const mockPhoto = 'data:image/jpeg;base64,...';
    cameraServiceSpy.subirFoto.and.returnValue(Promise.resolve(mockPhoto));

    await component.subirFotos();

    expect(component.photos.length).toBe(1);
    expect(component.photos[0]).toBe(mockPhoto);
  });

  it('should handle photo upload error', async () => {
    cameraServiceSpy.subirFoto.and.returnValue(Promise.reject('Error uploading photo'));

    await component.subirFotos();

    expect(notificationServiceSpy.presentToast).toHaveBeenCalledWith('ERROR: No se pudo subir la foto.', 'warning');
  });

  it('should delete a photo', () => {
    component.photos = ['photo1', 'photo2'];
    component.eliminarFoto(1);
    expect(component.photos.length).toBe(1);
    expect(component.photos).not.toContain('photo2');
    expect(notificationServiceSpy.presentToast).toHaveBeenCalledWith('Foto eliminada correctamente.', 'success');
  });

  it('should handle photo delete with invalid index', () => {
    component.photos = ['photo1', 'photo2'];
    spyOn(console, 'error');
    component.eliminarFoto(2);
    expect(console.error).toHaveBeenCalledWith('Índice de foto fuera de rango:', 2);
  });
});
