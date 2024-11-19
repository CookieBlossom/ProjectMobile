import { TestBed } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform } from '@ionic/angular';

describe('UserSessionService', () => {
  let service: UserSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NativeStorage, useValue: jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'remove']) },
        { provide: Platform, useValue: { ready: jasmine.createSpy().and.returnValue(Promise.resolve()) } }
      ],
    });
    service = TestBed.inject(UserSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
