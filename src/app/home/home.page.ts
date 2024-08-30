import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  Productos: any = [
    {
      id: 1,
      name: "Adidas Ultraboost 22",
      stock: 12,
      brand: "Adidas",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de alto rendimiento con amortiguación Boost y una parte superior Primeknit que brinda soporte, perfectas para carreras de larga distancia.",
      price: 30000
    },
    {
      id: 2,
      name: "Adidas Adizero Adios Pro",
      stock: 8,
      brand: "Adidas",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas ligeras diseñadas para velocidad, con espuma Lightstrike Pro y varillas de carbono para mayor impulso.",
      price: 30000
    },
    {
      id: 3,
      name: "Adidas Solar Glide ST 4",
      stock: 15,
      brand: "Adidas",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de running estables con amortiguación Boost y una parte superior que brinda soporte, diseñadas para entrenamientos diarios y carreras largas.",
      price: 30000
    },
    {
      id: 4,
      name: "Adidas Terrex Agravic TR",
      stock: 10,
      brand: "Adidas",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de trail running diseñadas para terrenos difíciles, con una parte superior de malla duradera y suela de goma para tracción en superficies irregulares.",
      price: 30000
    },
    {
      id: 5,
      name: "Adidas Supernova",
      stock: 20,
      brand: "Adidas",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de running cómodas con amortiguación Boost y Bounce para un paseo equilibrado y energizado, ideales para corredores cotidianos.",
      price: 30000
    },
    {
      id: 6,
      name: "Puma Velocity Nitro 2",
      stock: 10,
      brand: "Puma",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas ligeras de running con amortiguación Nitro foam para una carrera receptiva y cómoda, adecuadas para entrenamientos y carreras.",
      price: 30000
    },
    {
      id: 7,
      name: "Puma Deviate Nitro Elite Racer",
      stock: 8,
      brand: "Puma",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de alto rendimiento con placa de fibra de carbono y espuma Nitro Elite para máxima velocidad y eficiencia.",
      price: 30000
    },
    {
      id: 8,
      name: "Puma Liberate Nitro",
      stock: 12,
      brand: "Puma",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas minimalistas con espuma Nitro para una respuesta ligera, diseñadas para entrenamientos y carreras rápidas.",
      price: 30000
    },
    {
      id: 9,
      name: "Puma Eternity Nitro",
      stock: 9,
      brand: "Puma",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de running con tecnología de guía para mantener tu pisada en la trayectoria correcta, ideales para corredores que necesitan estabilidad extra.",
      price: 30000
    },
    {
      id: 10,
      name: "Puma Magnify Nitro",
      stock: 15,
      brand: "Puma",
      sizes: [30, 35, 40],
      gender: "Male",
      category: "Running",
      description: "Zapatillas de running con máxima amortiguación Nitro foam para una carrera cómoda y suave, ideales para entrenamiento diario y largas distancias.",
      price: 30000
    },
  ];
  Usuarios: any;
  constructor( private router:Router, private activedRoute:ActivatedRoute){
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
        this.Usuarios = this.router.getCurrentNavigation()?.extras?.state?.['usuarios'];
      }
    })
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
  dataToTabs(){
    this.router.navigate([])
  }
}
