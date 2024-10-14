import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Productos } from 'src/app/services/productos';
import { ProductSizes } from 'src/app/services/product-sizes';

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
  productSizes: ProductSizes | undefined;
  productId: number | null = null;
  brandsAvailable: any[] = [];
  sizesAvailable: any[] = [];
  categoriesAvailable: any[] = [];
  genderAvailable: any[] = [];

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
          this.selectDataStatic();
          this.cargarProducto(this.productId);
        }
      });
  }

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
          image: product.image,
        });
        this.oldImage = product.image;

        this.serviceBD.fetchProductSizes().subscribe((sizes: ProductSizes[]) => {
          const productSizes = sizes.filter(size => size.idproduct === product.idproduct);

          this.sizesAvailable.forEach(size => {
            const isSelected = productSizes.some(ps => ps.idsize === size.idsize);
            size.selected = isSelected;
          });
        });
      } else {
        this.serviceBD.presentAlert('Error', 'Producto no encontrado');
      }
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error cargando el producto');
    });
  }

  onSubmit() {
    if (this.productForm.valid && this.productId) {
      const imageToSave = this.newImage ? this.newImage : this.oldImage;
      const updatedProduct = {
        nameproduct: this.productForm.value.name,
        descriptionproduct: this.productForm.value.description,
        stockproduct: this.productForm.value.stock,
        idcategory: this.productForm.value.category,
        idbrand: this.productForm.value.brand,
        idgender: this.productForm.value.gender,
        image: imageToSave,
        priceproduct: this.productForm.value.price,
      };

      const selectedSizes = this.sizesAvailable.filter(size => size.selected).map(size => size.idsize);

      if (selectedSizes.length === 0) {
        this.serviceBD.presentAlert('Error', 'Debes seleccionar al menos una talla.');
        return;
      }

      this.serviceBD.editProduct(
        this.productId!,
        updatedProduct.nameproduct,
        updatedProduct.descriptionproduct,
        updatedProduct.stockproduct,
        updatedProduct.idcategory,
        updatedProduct.idbrand,
        updatedProduct.idgender,
        updatedProduct.image,
        updatedProduct.priceproduct
      ).then(() => {
        this.serviceBD.deleteProductSizes(this.productId!).then(() => {
          selectedSizes.forEach(sizeId => {
            this.serviceBD.insertProductSize(this.productId!, sizeId).catch(err => {
              this.serviceBD.presentAlert('Error', 'Error al actualizar talla');
            });
          });
          this.irPagina('/panel-adm');
        });
      }).catch(e => {
        this.serviceBD.presentAlert('Error', 'Error actualizando el producto');
      });
    } else {
      this.serviceBD.presentAlert('Error', 'Formulario inválido');
    }
  }

  selectDataStatic() {
    this.serviceBD.fetchBrands().then(data => {
      this.brandsAvailable = data || [];
    }).catch(() => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las marcas');
    });

    this.serviceBD.fetchCategories().then(data => {
      this.categoriesAvailable = data || [];
    }).catch(() => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las categorías');
    });

    this.serviceBD.fetchSizes().then(data => {
      this.sizesAvailable = data.map(size => ({
        ...size,
        selected: false,
      }));
    }).catch(() => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las tallas');
    });

    this.serviceBD.fetchGenders().then(data => {
      this.genderAvailable = data || [];
    }).catch(() => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo los géneros');
    });
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    this.newImage = image.webPath;
  };
  onSizeTouched(size: any) {
    size.touched = true;
  }
  isAnySizeSelected(): boolean {
    return this.sizesAvailable.some(size => size.selected);
  }
  isAnySizeTouched(): boolean {
    return this.sizesAvailable.some(size => size.touched);
  }
}
