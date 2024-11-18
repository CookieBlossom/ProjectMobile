import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Order } from 'src/app/services/order';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { Users } from 'src/app/services/users';

@Component({
  selector: 'app-panel-adm',
  templateUrl: './panel-adm.page.html',
  styleUrls: ['./panel-adm.page.scss'],
})
export class PanelAdmPage implements OnInit {
  products: Productos[] = [];
  users: Users[] = [];
  orders: Order[] = [];
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
        this.serviceBD.fetchUsers().subscribe((data: Users[]) => {
          this.users = data;
        });

        this.serviceBD.fetchOrder().subscribe((data: Order[]) => {
          this.orders = data;
        });
        this.serviceBD.searchProducts();
        this.serviceBD.searchUsers();
        this.serviceBD.searchOrders();
      });
  }

  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }
}
