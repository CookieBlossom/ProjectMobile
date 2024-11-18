import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Users } from 'src/app/services/users';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-modify-pass',
  templateUrl: './modify-pass.page.html',
  styleUrls: ['./modify-pass.page.scss'],
})
export class ModifyPassPage implements OnInit {
  user: Users | null = null;
  actualPassword: string = '';
  modifyForm: FormGroup;
  constructor(private serviceBD: ServiceBDService, private userSession:UserSessionService, private router:ActivatedRoute, private fb:FormBuilder, private route:Router) {
    this.modifyForm = this.fb.group({actualpassword: ['', [Validators.required, Validators.minLength(8)]],
      newpassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*.,]).+$')]],
      confirmpass: ['', [Validators.required]],}, { validators: this.matchPasswords('newpassword', 'confirmpass')});
   }
  get formControls() {
  return this.modifyForm.controls;
  }
  ngOnInit() {
    this.userSession.getUserSession().subscribe((user) => {
      this.user = user;
      console.log('Sesion actual', this.user);
    })
    this.getActualPassword();
  }
  private matchPasswords(newPasswordKey: string, confirmPasswordKey: string) {
    return (group: AbstractControl) => {
      const newPassword = group.get(newPasswordKey)?.value;
      const confirmPassword = group.get(confirmPasswordKey)?.value;
      if (newPassword !== confirmPassword) {
        group.get(confirmPasswordKey)?.setErrors({ notMatching: true });
      } else {
        group.get(confirmPasswordKey)?.setErrors(null);
      }
      return null;
    };
  }
  private getActualPassword() {
    this.router.queryParams.subscribe((params) => {
      this.actualPassword = params['actualPassword'] || '';
      console.log('Contraseña actual recibida:', this.actualPassword);

      if (this.actualPassword) {
        this.modifyForm.get('actualpassword')?.disable();
        this.modifyForm.patchValue({ actualpassword: this.actualPassword });
      }
    });
  }
  updatePassword() {
    if (!this.modifyForm.valid) {
      console.error('El formulario no es válido');
      return;
    }
    const actualPasswordInput = this.modifyForm.get('actualpassword')?.value;
    const newPassword = this.modifyForm.get('newpassword')?.value;
    if (this.user) {
      this.serviceBD.getUserPasswordByEmail(this.user.email).then((storedPassword) => {
        if (storedPassword !== actualPasswordInput) {
          this.modifyForm.get('actualpassword')?.setErrors({
            incorrectPassword: true,
          });
          console.error('La contraseña actual no coincide.');
          return;
        }
      }).catch((error) => {
        console.error('Error al validar la contraseña actual:', error);
      });
      this.serviceBD.editUser(this.user.rut,this.user.name,this.user.genderuser,this.user.email,newPassword,this.user.phone,this.user.idrol,this.user.imageuser).then((success) => {
        if (success) {
          const updatedUser = { ...this.user, password: newPassword } as Users;
          this.userSession.setUserSession(updatedUser).then(() => {
            this.serviceBD.searchUsers();
          });
          this.serviceBD.presentAlert('Cambio de Contraseña', 'Exitoso');
          this.modifyForm.reset();
          this.irPagina('/profile');
        } else {
          console.error('No se pudo actualizar el usuario en la base de datos.');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar la contraseña en la base de datos:', error);
      });
    }
  }
  irPagina(ruta: string) {
    this.route.navigate([ruta]);
  }
}
