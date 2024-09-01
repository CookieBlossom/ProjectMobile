import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-panel-adm',
  templateUrl: './panel-adm.page.html',
  styleUrls: ['./panel-adm.page.scss'],
})
export class PanelAdmPage implements OnInit {
  Productos: any;
  constructor( private router:Router, private activatedroute:ActivatedRoute) {
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
        productos: this.Productos
      }
    }
    console.log(this.Productos);
    this.router.navigate([ruta], navigationextras);
  }
}
