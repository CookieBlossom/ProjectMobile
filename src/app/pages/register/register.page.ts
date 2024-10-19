import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Users } from 'src/app/services/users';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  Usuarios: Users[] = [];
  structureUser: any = {
    rut: '',
    firstname: '',
    secondname: '',
    firstlastname: '',
    secondlastname: '',
    imageuser: '',
    genderuser: '',
    email: '',
    password: '',
    phone: null,
    idrol: 2
  };
  constructor(private fb: FormBuilder,private snackBar: MatSnackBar, private router: Router, private serviceBD:ServiceBDService, private api:ApiService) {
    this.registerForm = this.fb.group({rut: ['', [Validators.required, this.rutValidator]], email: ['', [Validators.required, Validators.email, this.gmailValidator]], password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).+$')]], confirmPassword: ['', [Validators.required]]}, { validator: this.passwordMatchValidator });
  }
  get formControls() {
    return this.registerForm.controls;
  }
  ngOnInit() {
    this.verificarConexionBD();
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.searchUsers();
      });
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  rutValidator(control: any) {
    const rutRegex = /^\d{8}-[0-9kK]{1}$/;
    return rutRegex.test(control.value) ? null : { invalidRut: true };
  }
  gmailValidator(control: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.serviceBD.findUserByEmail(this.registerForm.value.email)
        .then((emailExists: boolean) => {
          if (emailExists) {
            this.snackBar.open('El correo electrónico ya está registrado.', 'Cerrar', {duration: 3000,horizontalPosition: 'center',verticalPosition: 'bottom',});
          } else {
            this.serviceBD.findUserByRut(this.registerForm.value.rut)
              .then((rutExists: boolean) => {
                if (rutExists) {
                  this.snackBar.open('El RUT ya está registrado.', 'Cerrar', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                  });
                } else {this.api.getImageRandom().subscribe((response) => {
                    const catImageUrl = response[0]?.url || '';
                    const newUser = new Users(this.registerForm.value.rut,'','','','',catImageUrl,'',this.registerForm.value.email,this.registerForm.value.password,0,2);
                    this.serviceBD.registerUser(newUser.rut,newUser.firstname,newUser.secondname,newUser.firstlastname,newUser.secondlastname,newUser.imageuser,newUser.genderuser,newUser.email,newUser.password,newUser.phone,newUser.idrol
                    ).then(() => {
                      this.serviceBD.searchUsers();
                      this.showSuccessMessage();
                      this.irPagina('/login');
                    }).catch(error => {
                      this.snackBar.open('Error durante el registro. Intente nuevamente.', 'Cerrar', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom',});
                    });
                  }, error => {
                    this.snackBar.open('Error obteniendo la imagen de perfil, intenta nuevamente.', 'Cerrar', {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                    });
                  });
                }
              })
              .catch(error => {this.snackBar.open('Error durante la verificación del RUT. Intente nuevamente.', 'Cerrar', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom'});});
          }
        })
        .catch(error => {this.snackBar.open('Error durante la verificación del email. Intente nuevamente.', 'Cerrar', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom'});});
    } else {
      if (this.registerForm.errors?.['mismatch']) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {duration: 3000, horizontalPosition: 'center',verticalPosition: 'bottom'});
      } else {
        this.snackBar.open('Por favor, corrige los errores en el formulario', 'Cerrar', {duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom',});
      }
    }
  }
  resetForm(){
    this.structureUser = {rut: '', firstname: '', secondname: '', firstlastname: '', secondlastname: '', imageuser: '', genderuser: '', email: '', password: '', phone: null, idrol: 2};
  }
  irPagina(ruta:string) {
    this.router.navigate([ruta]);
  }
  showSuccessMessage() {
    this.snackBar.open('Registro exitoso', 'Cerrar', {duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom'});
  }
}
