import { TestBed } from '@angular/core/testing';
import { ServiceBDService } from './service-bd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ServiceBDService', () => {
  let service: ServiceBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Necesario para cualquier uso de HttpClient
      ],
      providers: [
        ServiceBDService,        // Incluye el servicio que estás probando
        SQLite,                  // Incluye SQLite como dependencia
        AlertController,         // Incluye el controlador de alertas de Ionic
        Platform                 // Incluye Platform si el servicio depende de esta clase
      ],
    });
    service = TestBed.inject(ServiceBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
