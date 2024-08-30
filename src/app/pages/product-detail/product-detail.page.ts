import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productId: any;
  Productos: any;
  Usuarios: any;
  constructor(private activatedroute:ActivatedRoute, private router:Router){ 
    this.activatedroute.paramMap.subscribe( params =>{
      this.productId = params.get('id');
      console.log('El id del producto es: ', this.productId);
    })
    this.activatedroute.queryParams.subscribe( params =>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
        this.Usuarios = this.router.getCurrentNavigation()?.extras?.state?.['usuarios'];
      }
    })
  }

  ngOnInit() {
  }
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
        usuarios: this.Usuarios
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
}
