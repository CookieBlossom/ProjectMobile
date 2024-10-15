import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Productos } from '../services/productos';
import { ServiceBDService } from '../services/service-bd.service';
import { filter } from 'rxjs/operators';
import { Users } from '../services/users';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  products: Productos[] = [];
  brandsAvailable: any[] = [];
  categoriesAvailable: any[] = [];
  genderAvailable: any[] = [];
  user: Users[] = [];
  constructor( private router:Router, private activedRoute:ActivatedRoute, private serviceBD:ServiceBDService, private nativeStorage:NativeStorage){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
      }
    })
  }
  ngOnInit() {
    this.verificarConexionBD();
    this.nativeStorage.getItem('userSession')
    .then((user) => {
      console.log('Sesión de usuario recuperada:', user);
    })
    .catch(error => {
      console.error('Error al recuperar la sesión:', error);
    });
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
        });
        this.serviceBD.searchProducts();
        this.selectDataStatic();
      });
  }

  selectDataStatic() {
    this.serviceBD.fetchCategories().then(data => {
      this.categoriesAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las categorías: ' + JSON.stringify(e));
    });
    this.serviceBD.fetchGenders().then(data => {
      this.genderAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo los géneros: ' + JSON.stringify(e));
    });
  }

  irPagina( ruta:string ){
      this.router.navigate([ruta]);
  }
  verDetalleProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: {id: productId}
    };
    this.router.navigate([`/product-detail`, productId], navigationExtras);
  }
}
