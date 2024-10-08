import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-adm-products',
  templateUrl: './adm-products.page.html',
  styleUrls: ['./adm-products.page.scss'],
})
export class AdmProductsPage {
  Productos: any;

  constructor( private router:Router, private activedRoute:ActivatedRoute, private alertController:AlertController){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    })
  }

  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
  modificarProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: { 
        productos: this.Productos,
      }
    };
    this.router.navigate(['/adm-modify', productId], navigationExtras);
  }

  async confirmarEliminacion(product: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarProducto(product);
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarProducto(product: any) {
    this.Productos = this.Productos.filter((p: { id: any; }) => p.id !== product.id);
    console.log('Producto eliminado:', product);
  }
}