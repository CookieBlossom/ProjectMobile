import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Productos } from 'src/app/services/productos';

@Component({
  selector: 'app-adm-modify',
  templateUrl: './adm-modify.page.html',
  styleUrls: ['./adm-modify.page.scss'],
})
export class AdmModifyPage implements OnInit {
  productForm: FormGroup;
  oldImage: any;
  newImage: any;
  productSelected: Productos | undefined;
  productId: number | null = null;
  brandsAvailable: any[] = [];
  sizesAvailable: any[] = [];
  categoriesAvailable: any[] = [];

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceBD: ServiceBDService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.productId = navigation.extras.state['id'];
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
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        if (this.productId) {
          this.cargarProducto(this.productId);  // Cargar el producto por ID
        }
        this.selectDataStatic();  // Cargar las marcas, categorías y tallas
      });
  }

  // Método para buscar el producto por su ID y rellenar el formulario
  cargarProducto(id: number) {
    this.serviceBD.getProductById(id).then((product: Productos | null) => {
      if (product) {
        this.productSelected = product;
        this.productForm.patchValue({
          name: product.nameproduct,
          description: product.descriptionproduct,
          price: product.priceproduct,
          category: product.idcategory,
          brand: product.idbrand,
          gender: product.idgender,
          stock: product.stockproduct,
          image: product.image
        });
        this.oldImage = product.image;
      } else {
        this.serviceBD.presentAlert('Error', 'Producto no encontrado');
      }
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error cargando el producto: ' + JSON.stringify(e));
    });
  }

  onSubmit() {
    if (this.productForm.valid && this.productId) {
      const updatedProduct = {
        nameproduct: this.productForm.value.name,
        descriptionproduct: this.productForm.value.description,
        stockproduct: this.productForm.value.stock,
        idcategory: this.productForm.value.category,
        idbrand: this.productForm.value.brand,
        idgender: this.productForm.value.gender,
        image: this.newImage,
        priceproduct: this.productForm.value.price
      };
      this.serviceBD.editProduct(
        this.productId,
        updatedProduct.nameproduct,
        updatedProduct.descriptionproduct,
        updatedProduct.stockproduct,
        updatedProduct.idcategory,
        updatedProduct.idbrand,
        updatedProduct.idgender,
        updatedProduct.image,
        updatedProduct.priceproduct
      ).then(() => {
        this.serviceBD.presentAlert('Éxito', 'Producto modificado correctamente');
        this.irPagina('/panel-adm');
      }).catch(e => {
        this.serviceBD.presentAlert('Error', 'Error actualizando el producto: ' + JSON.stringify(e));
      });
    } else {
      this.serviceBD.presentAlert('Error', 'Formulario inválido');
    }
  }

  selectDataStatic() {
    this.serviceBD.fetchBrands().then(data => {
      this.brandsAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las marcas: ' + JSON.stringify(e));
    });

    this.serviceBD.fetchCategories().then(data => {
      this.categoriesAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las categorías: ' + JSON.stringify(e));
    });

    this.serviceBD.fetchSizes().then(data => {
      this.sizesAvailable = data.map(size => ({
        ...size,
        selected: false
      }));
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las tallas: ' + JSON.stringify(e));
    });
  }

  onSizeTouched(size: any) {
    size.touched = true;
  }

  isAnySizeSelected(): boolean {
    return this.sizesAvailable.some(size => size.selected);
  }

  isAnySizeTouched(): boolean {
    return this.sizesAvailable.some(size => size.touched);
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.newImage = image.webPath;
  };
}
