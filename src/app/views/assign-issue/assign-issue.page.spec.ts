import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignIssuePage } from './assign-issue.page';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../helpers/loading.service';
import { NotificationService } from '../../helpers/notification.service';
import { LogsService } from 'src/app/services/logs.service';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('AssignIssuePage', () => {
  let component: AssignIssuePage;
  let fixture: ComponentFixture<AssignIssuePage>;

  let authServiceMock: any;
  let loadingServiceMock: any;
  let notificationServiceMock: any;
  let logsServiceMock: any;
  let navCtrlMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getApiUrl', 'getAccessToken', 'getUserFromToken']);
    loadingServiceMock = jasmine.createSpyObj('LoadingService', ['presentLoading', 'dismissLoading']);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', ['presentToast']);
    logsServiceMock = jasmine.createSpyObj('LogsService', ['saveGeneralLog']);
    navCtrlMock = jasmine.createSpyObj('NavController', ['back']);

    await TestBed.configureTestingModule({
      declarations: [AssignIssuePage],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: LogsService, useValue: logsServiceMock },
        { provide: NavController, useValue: navCtrlMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authServiceMock.getApiUrl.and.returnValue('api/url');
    authServiceMock.getAccessToken.and.returnValue(Promise.resolve('token'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on creation', () => {
    expect(component.incidentForm).toBeDefined();
  });

  it('should load technicians on loadTecnicos call', () => {
    const technicians = [{ id: 1, name: 'Technician 1' }];
    authServiceMock.getAccessToken.and.returnValue(Promise.resolve('token'));
    spyOn(component['http'], 'get').and.returnValue(of(technicians));

    component.loadTecnicos();
    expect(component.tecnicos).toEqual(technicians);
  });

  it('should prefill form with incident data', () => {
    const incident = {
      CT_Titulo_Incidencia: 'Test Title',
      T_Afectacion: { CT_Descripcion: 'Test Afectacion' },
      T_Riesgo: { CT_Descripcion: 'Test Riesgo' },
      T_Prioridad: { CT_Descripcion: 'Test Prioridad' },
      T_Categoria: { CT_Descripcion: 'Test Categoria' }
    };

    component.prefillForm(incident);
    expect(component.incidentForm.value.titulo).toEqual(incident.CT_Titulo_Incidencia);
    expect(component.incidentForm.value.afectacion).toEqual(incident.T_Afectacion.CT_Descripcion);
    expect(component.incidentForm.value.riesgo).toEqual(incident.T_Riesgo.CT_Descripcion);
    expect(component.incidentForm.value.prioridad).toEqual(incident.T_Prioridad.CT_Descripcion);
    expect(component.incidentForm.value.categoria).toEqual(incident.T_Categoria.CT_Descripcion);
  });

  it('should show a notification if the form is invalid on submit', () => {
    component.onSubmit();
    expect(notificationServiceMock.presentToast).toHaveBeenCalledWith('Por favor complete todos los campos requeridos', 'danger');
  });

  it('should call the proper services and navigate back on successful form submission', async () => {
    component.incidentForm.setValue({
      titulo: 'Test Title',
      tecnico: '1',
      afectacion: '1',
      riesgo: '1',
      prioridad: '1',
      categoria: '1'
    });

    component.incidencia = {
      CN_ID_Incidente: 1,
      CT_Titulo_Incidencia: 'Test Title'
    };

    spyOn(component['http'], 'post').and.returnValue(of({}));
    spyOn(component['http'], 'put').and.returnValue(of({}));
    authServiceMock.getUserFromToken.and.returnValue(Promise.resolve({ CN_ID_Usuario: 1, CT_Nombre: 'Test User' }));

    await component.onSubmit();

    expect(notificationServiceMock.presentToast).toHaveBeenCalledWith('Incidencia asignada correctamente', 'success');
    expect(navCtrlMock.back).toHaveBeenCalled();
  });
});
