import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {Camera, CameraResultType } from '@capacitor/camera';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  imageExample: any;
  Productos: any;
  constructor( private router:Router, private activatedroute:ActivatedRoute, private alertController:AlertController, private nativeStorage:NativeStorage) {
    this.activatedroute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    })
   }

  ngOnInit() {
  }
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
  async confirmarCierre() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro?`,
      cssClass: 'alert',
      buttons: [
        {
          text: 'Si',
          role: 'cancel',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'No',
          handler: () => {

          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.nativeStorage.remove('userSession')
      .then(() => {
        console.log('Sesión cerrada correctamente!');
        this.router.navigate(['/login']);  // Redirigir al login o página principal
      })
      .catch(error => {
        console.error('Error cerrando la sesión', error);
      });
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imageExample = image.webPath;
  };
}
