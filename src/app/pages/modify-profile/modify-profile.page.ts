import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.page.html',
  styleUrls: ['./modify-profile.page.scss'],
})
export class ModifyProfilePage implements OnInit {
  profileForm: FormGroup;
  Productos: any;

  constructor(private fb: FormBuilder, private router: Router, private activedRoute:ActivatedRoute) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')]], // Validación de teléfono
      city: ['', Validators.required],
      comuna: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5)]],
    });
    this.activedRoute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    })
  }

  ngOnInit() {}

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Formulario válido', this.profileForm.value);
      alert('Datos cambiados');
      console.log(this.Productos);
      this.irPagina('/home');
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