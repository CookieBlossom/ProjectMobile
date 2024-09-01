import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IonicModule } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    IonicModule
  ],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  Usuarios: any[] = [];
  newUsuario: any = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    city: '',
    comuna: '',
    postalCode: '',
    password: '',
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[+0-9]{10,15}$')]],
      city: ['', [Validators.required]],
      comuna: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.maxLength(5)]],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*])[A-Za-z0-9.!@#$%^&*]{8,}$')
        ]
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]] 
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.newUsuario = {
        email: this.registerForm.value.email,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        address: this.registerForm.value.address,
        phone: this.registerForm.value.phone,
        city: this.registerForm.value.city,
        comuna: this.registerForm.value.comuna,
        postalCode: this.registerForm.value.postalCode,
        password: this.registerForm.value.password,
      };

      this.Usuarios.push(this.newUsuario);
      this.showSuccessMessage();
      this.irAPaginaUsuario(this.newUsuario);
      
    } else {
      if (this.registerForm.errors?.['mismatch']) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else {
        this.snackBar.open('Por favor, corrige los errores en el formulario', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    }
  }

  irAPaginaUsuario(user: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        Usuarios: this.Usuarios
      }
    };
    this.router.navigate(['/login'], navigationExtras);
  }

  showSuccessMessage() {
    this.snackBar.open('Registro exitoso', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}