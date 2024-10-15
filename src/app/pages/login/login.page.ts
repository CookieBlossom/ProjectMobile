import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private serviceBD:ServiceBDService, private nativeStorage:NativeStorage) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).+$'),
        ],
      ],
    });
  }

  ngOnInit() {}

  login(email: string, password: string) {
    this.serviceBD.loginUser(email, password)
      .then(user => {
        if (user) {
          this.nativeStorage.setItem('userSession', user)
            .then(() => {
              console.log('Sesión guardada correctamente!');
              this.router.navigate(['/home']);
            })
            .catch(error => {
              this.serviceBD.presentAlert('Login','Error guardando la sesión' + error);
            });
        } else {
          this.serviceBD.presentAlert('Login','Login fallido: usuario no encontrado o contraseña incorrecta.');
        }
      });
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  get formControls() {
    return this.loginForm.controls;
  }
}
