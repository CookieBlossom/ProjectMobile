import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  Productos: any;
  Usuarios: any;
  constructor( private router:Router, private activedRoute:ActivatedRoute){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
        this.Usuarios = this.router.getCurrentNavigation()?.extras?.state?.['usuarios'];
      }
    })
  }
  ngOnInit() {
  }
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
