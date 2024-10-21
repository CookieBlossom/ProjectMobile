import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Order } from 'src/app/services/order';
import { OrderHistory } from 'src/app/services/order-history';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Users } from 'src/app/services/users';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  products: Productos[] = [];
  user: Users[]=[];
  orders: Order[]=[];
  historyOrder: OrderHistory[]=[]
  constructor(private serviceBD: ServiceBDService, private router:Router, private serviceSession: UserSessionService) { }

  ngOnInit() {
    this.verificarConexionBD();
  }
  verificarConexionBD() {
    this.serviceBD
      .dbReady()
      .pipe(filter((isReady) => isReady))
      .subscribe(() => {
        this.serviceSession.getUserSession().subscribe(async (user) => {
          if (user) {
            this.traerOrdenes(user.rut);
          } else {
            console.error('No se encontró una sesión de usuario activa.');
          }
        });
        this.serviceBD.searchProducts();
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
        });
      });
  }
  traerOrdenes(rut: string) {
    this.serviceBD.getOrdersByRut(rut).then((orders: Order[]) => {
      this.orders = orders;
    }).catch(error => {
      console.error('Error al obtener las órdenes:', error);
    });
    this.serviceBD.getOrderHistoryByRut(rut).then((history: OrderHistory[]) => {
      this.historyOrder = history;
    }).catch(error => {
      console.error('Error al obtener el historial de órdenes:', error);
    });
  }
  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }
}
