import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {
  forgotForm: FormGroup;
  constructor(private router: Router, private serviceBD:ServiceBDService, private fb: FormBuilder) {
    this.forgotForm = this.fb.group({email: ['', [Validators.required, Validators.email]]});
  }
  get formControls() {
    return this.forgotForm.controls;
  }
  ngOnInit() {
    this.verificarConexionBD();
  }
  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.searchUsers();
      });
  }
  resetpass() {
    const email = this.forgotForm.get('email')?.value;

    if (this.forgotForm.valid) {
      this.serviceBD.findUserByEmail(email).then((exists) => {
        if (exists) {
          this.serviceBD.presentAlert('Usuario encontrado', 'Se ha encontrado el usuario por su correo.');
          this.serviceBD.getUserPasswordByEmail(email).then((password) => {
            if (password) {
              this.router.navigate(['/reset-password'], {
                queryParams: {
                  email,
                  actualPassword: password,
                  fromForgotPassword: true,
                },
              });
            } else {
              // Manejo de error si no se encuentra la contraseña
              console.error('No se pudo recuperar la contraseña.');
            }
          }).catch((error) => {
            // Manejo de error en getUserPasswordByEmail
            console.error('Error al obtener la contraseña:', error);
          });
        } else {
          // El email no existe
          console.log('El email no está registrado.');
        }
      }).catch((error) => {
        // Manejo de error en findUserByEmail
        console.error('Error al buscar el email:', error);
      });
    } else {
      // Formulario inválido
      console.log('El formulario no es válido.');
    }
  }

}
