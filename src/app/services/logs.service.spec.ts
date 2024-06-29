import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LogsService } from './logs.service';

describe('LogsService', () => {
  let service: LogsService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getApiUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogsService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(LogsService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mock API URL
    authService.getApiUrl.and.returnValue('http://localhost:3000/api');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save general log', async () => {
    const logData = { message: 'Test log message' };

    // Call the saveGeneralLog method
    const saveLogPromise = service.saveGeneralLog(logData);

    // Expect a POST request to the general logs endpoint
    const req = httpMock.expectOne('http://localhost:3000/api/logsG');
    expect(req.request.method).toBe('POST');

    // Respond with a success status
    req.flush({});

    // Ensure the promise resolves successfully
    await expectAsync(saveLogPromise).toBeResolved();
  });

  it('should save state log', async () => {
    const logData = { message: 'Test state log message' };

    // Call the saveStateLog method
    const saveLogPromise = service.saveStateLog(logData);

    // Expect a POST request to the state logs endpoint
    const req = httpMock.expectOne('http://localhost:3000/api/logsE');
    expect(req.request.method).toBe('POST');

    // Respond with a success status
    req.flush({});

    // Ensure the promise resolves successfully
    await expectAsync(saveLogPromise).toBeResolved();
  });

  it('should format the date correctly in saveGeneralLog', async () => {
    const logData = { message: 'Test log message' };

    spyOn(service, 'padNumber').and.callThrough(); // Spy on the padNumber method

    // Call the saveGeneralLog method
    const saveLogPromise = service.saveGeneralLog(logData);

    // Expect a POST request to the general logs endpoint
    const req = httpMock.expectOne('http://localhost:3000/api/logsG');
    expect(req.request.method).toBe('POST');

    // Check that the request body includes a correctly formatted date
    const now = new Date();
    const formattedDateTime = now.getFullYear().toString() +
                              service.padNumber(now.getMonth() + 1) +
                              service.padNumber(now.getDate()) +
                              service.padNumber(now.getHours()) +
                              service.padNumber(now.getMinutes()) +
                              service.padNumber(now.getSeconds());

    expect(req.request.body.CN_ID_Bitacora_General).toBe(formattedDateTime);

    // Respond with a success status
    req.flush({});

    // Ensure the promise resolves successfully
    await expectAsync(saveLogPromise).toBeResolved();
  });
});
