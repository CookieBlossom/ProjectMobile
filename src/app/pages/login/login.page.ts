import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { // Inyecta el Router
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).+$')
        ]
      ]
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

  get formControls() {
    return this.loginForm.controls;
  }
}
