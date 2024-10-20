import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { filter } from 'rxjs/operators';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router,private serviceBD: ServiceBDService,private nativeStorage: NativeStorage, private serviceSession:UserSessionService){
    this.loginForm = this.fb.group({email: ['', [Validators.required, Validators.email]],password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*.,]).+$')]]});
  }
  ngOnInit(){
    this.verificarConexionBD();
  }
  get formControls() {
    return this.loginForm.controls;
  }
  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.serviceBD.loginUser(email, password)
      .then(user => {
        if (user) {
          this.serviceBD.presentAlert('Login exitoso', `Bienvenido`);
          this.serviceSession.setUserSession(user).then(() => {
            this.nativeStorage.setItem('userSession', JSON.stringify(user))
              .then(() => {
                console.log('Sesión actualizada en NativeStorage');
                this.irPagina('/home');
              })
              .catch(error => {
                console.error('Error actualizando la sesión en NativeStorage:', error);
              });
          });
        } else {
          this.serviceBD.presentAlert('Error de login', 'Usuario no encontrado o contraseña incorrecta.');
        }
      })
      .catch(error => {
        console.error('Error en el login:', error);
      });
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.searchUsers();
      });
  }
  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
}
