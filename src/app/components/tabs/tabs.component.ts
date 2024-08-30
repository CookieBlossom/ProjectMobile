import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {
  @Input() Productos: any;
  
  Usuarios: any;
  constructor( private router:Router, private activedRoute:ActivatedRoute){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Usuarios = this.router.getCurrentNavigation()?.extras?.state?.['usuarios'];
      }
    })
  }
  ngOnInit() {}
  irPagina( ruta:string ){
    console.log(this.Productos, this.Usuarios);
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
        usuarios: this.Usuarios,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
  
}
