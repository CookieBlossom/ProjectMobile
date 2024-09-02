import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-panel-add',
  templateUrl: './panel-add.page.html',
  styleUrls: ['./panel-add.page.scss'],
})
export class PanelAddPage implements OnInit {
  Productos: any;
  newProducto: any = {
    id: null,
    name: '',
    stock: 0,
    brand: '',
    sizes: [],
    gender: '',
    category: '',
    description: '',
    price: 0,
    image: ''
  };

  constructor( private router:Router, private activedRoute:ActivatedRoute){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    })
  }

  ngOnInit() {}

  addProducto() {
    if (!this.newProducto.name || !this.newProducto.stock || !this.newProducto.brand ||
        !this.newProducto.gender || !this.newProducto.category || !this.newProducto.description ||
        !this.newProducto.price || !this.newProducto.image){
      console.error('Por favor, complete todos los campos obligatorios.');
      return;
    }
    this.newProducto.id = this.Productos ? this.Productos.length + 1 : 1;
    if (this.Productos) {
      this.Productos.push({...this.newProducto});
    } else {
      this.Productos = [this.newProducto];
    }
    this.resetForm();
    this.irPagina('/panel-adm');
  }

  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
  resetForm() {
    this.newProducto = {
      id: null,
      name: '',
      stock: 0,
      brand: '',
      sizes: [],
      gender: '',
      category: '',
      description: '',
      price: 0,
      image: ''
    };
  }
}