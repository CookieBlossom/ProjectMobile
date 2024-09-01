import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  Productos: any;
  constructor( private router:Router, private activatedroute:ActivatedRoute, private alertController:AlertController) {
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
            this.irPagina( '/login' );
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
}
