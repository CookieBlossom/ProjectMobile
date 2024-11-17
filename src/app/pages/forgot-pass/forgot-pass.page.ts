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
  constructor(private router: Router, private serviceBD:ServiceBDService, private fb: FormBuilder, private userSession:UserSessionService) {
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
      // Verificar si el email existe
      this.serviceBD.findUserByEmail(email).then((exists) => {
        if (exists) {
          this.serviceBD.presentAlert('Usuario encontrado', 'Se ha encontrado el usuario por su correo.');
          this.serviceBD.getUserByEmail(email).then((user) => {
            if (user) {
              // Setear la sesión del usuario
              this.userSession.setUserSession(user).then(() => {
                console.log('Sesión del usuario establecida:', user);
                this.router.navigate(['/modify-pass'], {
                  queryParams: {
                    email: user.email,
                    actualPassword: user.password,
                    fromForgotPassword: true,
                  },
                });
              }).catch((error) => {
                console.error('Error al establecer la sesión del usuario:', error);
              });
            } else {
              console.error('No se pudo obtener los datos del usuario.');
            }
          }).catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
          });
        } else {
          console.log('El email no está registrado.');
          this.serviceBD.presentAlert('Error', 'El correo electrónico no está registrado.');
        }
      }).catch((error) => {
        console.error('Error al buscar el email:', error);
        this.serviceBD.presentAlert('Error', 'Error al buscar el correo electrónico.');
      });
    }
  }
}
