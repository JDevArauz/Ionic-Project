import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getUserFromToken']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: spy }
      ]
    });

    userService = TestBed.inject(UserService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should return user from authService', async () => {
    const expectedUser = { id: 2, name: 'Juan' };
    authServiceSpy.getUserFromToken.and.returnValue(Promise.resolve(expectedUser));

    const user = await userService.getUser();
    expect(user).toEqual(expectedUser);
    expect(authServiceSpy.getUserFromToken).toHaveBeenCalled();
  });
});
