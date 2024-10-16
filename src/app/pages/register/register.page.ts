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
import { Users } from 'src/app/services/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule, IonicModule],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  Usuarios: Users[] = [];
  newUsuario: any = {
    rut: '',
    email: '',
    password: '',
    idrol: 2
  };
  constructor(private fb: FormBuilder,private snackBar: MatSnackBar, private router: Router) {
    this.registerForm = this.fb.group({
      rut: ['', [Validators.required, this.rutValidator]],
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).+$')]], // Password con mayúsculas, números y símbolos especiales
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  rutValidator(control: any) {
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]{1}$/;
    return rutRegex.test(control.value) ? null : { invalidRut: true };
  }
  gmailValidator(control: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+gmail\.com$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.newUsuario = {
        rut: this.registerForm.value.rut,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      // this.Usuarios.push(this.newUsuario);
      // this.showSuccessMessage();
      // this.irAPaginaUsuario(this.newUsuario);

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

  irPagina(ruta:string) {
    this.router.navigate([ruta]);
  }

  showSuccessMessage() {
    this.snackBar.open('Registro exitoso', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
