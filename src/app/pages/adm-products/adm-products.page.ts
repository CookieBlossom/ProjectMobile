import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
@Component({
  selector: 'app-adm-products',
  templateUrl: './adm-products.page.html',
  styleUrls: ['./adm-products.page.scss'],
})
export class AdmProductsPage {
  products: Productos[] = [];
  constructor( private router:Router, private activedRoute:ActivatedRoute, private alertController:AlertController, private serviceBD:ServiceBDService){
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
        this.serviceBD.searchProducts();
      });
  }
  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }
  modificarProducto(productId: number) {
    this.router.navigate(['/adm-modify', productId]);
  }
  // async confirmarEliminacion(product: any) {
  //   const alert = await this.alertController.create({
  //     header: 'Confirmar eliminación',
  //     message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Eliminación cancelada');
  //         }
  //       },
  //       {
  //         text: 'Eliminar',
  //         handler: () => {
  //           this.eliminarProducto(product);
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  // eliminarProducto(product: any) {
  //   this.Productos = this.Productos.filter((p: { id: any; }) => p.id !== product.id);
  //   console.log('Producto eliminado:', product);
  // }
}
