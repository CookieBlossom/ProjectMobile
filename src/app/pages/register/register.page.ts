import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IonicModule } from '@ionic/angular';

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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group(
      {
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
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Datos del formulario:', this.registerForm.value);
      this.showSuccessMessage();
    } else {
      console.log('Formulario inválido');
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

  showSuccessMessage() {
    this.snackBar.open('Registro exitoso', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
