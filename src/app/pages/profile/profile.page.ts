import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Users } from 'src/app/services/users';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  imageUser: any;
  user: Users | null = null;
  products: Productos[] = [];
  constructor(private router: Router,private activatedroute: ActivatedRoute,private alertController: AlertController,private nativeStorage: NativeStorage,private serviceBD: ServiceBDService, private serviceSession: UserSessionService){
    this.activatedroute.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {}
    });
  }
  ngOnInit() {
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
        });
        this.user = null;
        this.obtenerSesionUsuario();
      });
  }
  obtenerSesionUsuario() {
    this.serviceSession.getUserSession().subscribe(user => {
      if (user) {
        console.log('Sesión de usuario recuperada:', user);
        this.user = user;
        if (this.user?.imageuser) {
          this.imageUser = this.user.imageuser;
        }
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
  async confirmarCierre() {
    const alert = await this.alertController.create({
      header: 'Confirmar cierre de sesión',
      message: `¿Estás seguro?`,
      cssClass: 'alert',
      buttons: [
        {text: 'Sí',role: 'cancel',handler: () => {this.logout();}},
        {text: 'No',handler: () => {}}
      ]
    });
    await alert.present();
  }
  logout() {
    this.serviceSession.deleteUserSession()
      .then(() => {
        console.log('Sesión cerrada correctamente');
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error cerrando la sesión:', error);
      });
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imageUser = image.webPath;
  };
}
