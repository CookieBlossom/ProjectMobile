import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-panel-add',
  templateUrl: './panel-add.page.html',
  styleUrls: ['./panel-add.page.scss'],
})
export class PanelAddPage implements OnInit {
  imageExample!: any;
  imageTouched: boolean = false;
  newProducto: any = {
    name: '',
    description: '',
    stock: 0,
    idcategory: 0,
    idbrand: 0,
    idgender: 0,
    image: this.imageExample,
    priceproduct: 0
  };
  brandsAvailable: any[] = [];
  sizesAvailable: any[] = [];
  categoriesAvailable: any[] = [];
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private serviceBD: ServiceBDService
  ) {}
  ngOnInit() {
    this.verificarConexionBD();
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.selectDataStatic();
      });
  }
  irPagina(ruta: string) {
    let navigationextras: NavigationExtras = { state: {} };
    this.router.navigate([ruta], navigationextras);
  }
  resetForm() {
    this.newProducto = {
      name: '',
      description: '',
      stock: 0,
      idcategory: 0,
      idbrand: 0,
      idgender: 0,
      image: this.imageExample,
      priceproduct: 0
    };
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.imageExample = image.webPath;
    this.imageTouched = true;
  };
  insertarProductos() {
    const selectedSizes = this.sizesAvailable.filter(size => size.selected).map(size => size.idsize);
    if (selectedSizes.length === 0) {
      this.serviceBD.presentAlert('Error', 'Debes seleccionar al menos una talla.');
      return;
    }
    this.serviceBD.insertProduct(
      this.newProducto.name,
      this.newProducto.description,
      this.newProducto.stock,
      this.newProducto.idcategory,
      this.newProducto.idbrand,
      this.newProducto.idgender,
      this.imageExample,
      this.newProducto.priceproduct
    ).then(productId => {
      if (productId) {
        selectedSizes.forEach(sizeId => {
          this.serviceBD.insertProductSize(productId, sizeId)
            .catch(err => this.serviceBD.presentAlert('Error', 'Error al insertar talla.'));
        });
        this.serviceBD.searchProductSizes().then(() => {
          this.serviceBD.presentAlert('Éxito', 'Producto y tallas agregados correctamente.');
        });
      }
    }).catch(err => {
      this.serviceBD.presentAlert('Error', 'Error al insertar producto.');
    });

    this.resetForm();
    this.irPagina('/adm-products');
  }
  selectDataStatic() {
    this.serviceBD.fetchBrands()
      .then(data => {
        this.brandsAvailable = data.length > 0 ? data : [];
      })
      .catch(() => this.serviceBD.presentAlert('Error', 'Error obteniendo las marcas.'));

    this.serviceBD.fetchCategories()
      .then(data => {
        this.categoriesAvailable = data.length > 0 ? data : [];
      })
      .catch(() => this.serviceBD.presentAlert('Error', 'Error obteniendo las categorías.'));

    this.serviceBD.fetchSizes()
      .then(data => {
        this.sizesAvailable = data.map(size => ({ ...size, selected: false }));
      })
      .catch(() => this.serviceBD.presentAlert('Error', 'Error obteniendo las tallas.'));
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
}
