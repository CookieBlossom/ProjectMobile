import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page'; // Importa el componente standalone

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: RegisterPage }]), // Usa el componente standalone en la configuración de rutas
  ]
})
export class RegisterPageModule {}
