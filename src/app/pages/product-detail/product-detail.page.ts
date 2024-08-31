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
  constructor(private activatedroute:ActivatedRoute, private router:Router){
    if(this.router.getCurrentNavigation()?.extras.state){
      this.productId = this.activatedroute.snapshot.paramMap.get('id');
      this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      console.log(this.productId);    
      console.log(this.Productos);
    }
  
  } 
  ngOnInit() {

  }
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
}
