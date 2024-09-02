import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
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

  onLogin() {
    if (this.loginForm.valid) {
      // Aquí deberías realizar la lógica de autenticación (llamar a un servicio de autenticación, etc.)
      console.log('Formulario válido:', this.loginForm.value);
      // Suponiendo que la autenticación es exitosa:
      this.router.navigate(['/home']); // Redirige a la página de inicio
    } else {
      console.log('Formulario inválido');
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']); // Redirige a la página de registro
  }

  get formControls() {
    return this.loginForm.controls;
  }
}
