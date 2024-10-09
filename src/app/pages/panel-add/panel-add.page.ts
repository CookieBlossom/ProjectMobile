import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/services/service-bd.service'; // Importa el servicio de la base de datos

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
    sizes: [], // Asume que sizes es un array, ajusta según tu lógica
    gender: '',
    category: '',
    description: '',
    price: 0,
    image: '' // Podrías cambiar a tipo `any` si vas a subir imágenes
  };

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private serviceBD: ServiceBDService // Inyecta el servicio de la base de datos
  ) {
    this.activedRoute.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    });
  }

  ngOnInit() {
    // Llamada para verificar la conexión a la base de datos al iniciar el componente
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    // Verificar si la base de datos está lista
    this.serviceBD.dbReady().subscribe(isReady => {
      if (isReady) {
        console.log('Conexión a la base de datos establecida correctamente.');
        this.serviceBD.createTables(); // Crear las tablas en caso de que aún no se hayan creado
      } else {
        console.error('No se pudo establecer la conexión a la base de datos.');
      }
    });
  }

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

  irPagina(ruta: string) {
    let navigationextras: NavigationExtras = {
      state: {
        productos: this.Productos,
      }
    };
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
