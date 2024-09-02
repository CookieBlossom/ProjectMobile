import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-adm-modify',
  templateUrl: './adm-modify.page.html',
  styleUrls: ['./adm-modify.page.scss'],
})
export class AdmModifyPage implements OnInit {
  productForm: FormGroup;
  Productos: any;
  productoDetalle: any;
  productId: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      this.productId = this.activatedroute.snapshot.paramMap.get('id');
      console.log(this.productId);
      console.log(this.Productos);
    }

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      gender: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.verDetalle();
  }

  verDetalle() {
    this.productoDetalle = this.Productos.find((producto: any) => producto.id == this.productId);
    if (this.productoDetalle) {
      console.log('Producto encontrado:', this.productoDetalle);
      this.productForm.patchValue(this.productoDetalle);
    } else {
      console.log('Error: Producto no encontrado');
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const index = this.Productos.findIndex((p: any) => p.id == this.productId);
      if (index !== -1) {
        this.Productos[index] = { ...this.Productos[index], ...this.productForm.value };
        alert('Datos del producto cambiados');
        this.irPagina('/panel-adm');
      } else {
        console.error('Producto no encontrado para actualizar');
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  irPagina(ruta: string) {
    let navigationextras: NavigationExtras = {
      state: {
        productos: this.Productos,
      }
    };
    this.router.navigate([ruta], navigationextras);
  }
}