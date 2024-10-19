import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Productos } from '../services/productos';
import { ServiceBDService } from '../services/service-bd.service';
import { filter } from 'rxjs/operators';
import { Users } from '../services/users';
import { SessionService } from '../services/session.service'; // Nuevo servicio para sesión

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
  userSession: Users | null = null; // Variable para almacenar el usuario de sesión

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private serviceBD: ServiceBDService,
    private sessionService: SessionService // Inyectamos el nuevo servicio de sesión
  ) {
    this.activedRoute.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        // Aquí puedes manejar los parámetros si es necesario
      }
    });
  }

  ngOnInit() {
    this.verificarConexionBD();
    this.sessionService.getUserSession().subscribe((user: Users | null) => {
      this.userSession = user;
      console.log('Sesión de usuario recuperada en Home:', this.userSession);
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

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }

  verDetalleProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: { id: productId }
    };
    this.router.navigate([`/product-detail`, productId], navigationExtras);
  }
}
