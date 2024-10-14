import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';

@Component({
  selector: 'app-panel-adm',
  templateUrl: './panel-adm.page.html',
  styleUrls: ['./panel-adm.page.scss'],
})
export class PanelAdmPage implements OnInit {
  products: Productos[] = [];
  constructor( private router:Router, private activatedroute:ActivatedRoute, private serviceBD:ServiceBDService) {
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
}
