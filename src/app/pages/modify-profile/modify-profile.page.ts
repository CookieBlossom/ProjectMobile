import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { filter } from 'rxjs/operators';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Users } from 'src/app/services/users';

@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.page.html',
  styleUrls: ['./modify-profile.page.scss'],
})
export class ModifyProfilePage implements OnInit {
  profileForm: FormGroup;
  genderAvailable: any[]=[];
  user: Users | null = null;
  constructor( private fb: FormBuilder, private router: Router, private activedRoute: ActivatedRoute, private nativeStorage: NativeStorage, private serviceBD: ServiceBDService, private serviceSession: UserSessionService) {
    this.profileForm = this.fb.group({
      rut: [{ value: this.user?.rut || '', disabled: true }, Validators.required],
      firstname: ['', Validators.required],
      secondname: ['', Validators.required],
      firstlastname: ['', Validators.required],
      secondlastname: ['', Validators.required],
      genderuser: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).+$')]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{9,12}$')]]
    });
  }
  rutValidator(control: any) {
    const rutRegex = /^\d{8}-[0-9kK]{1}$/;
    return rutRegex.test(control.value) ? null : { invalidRut: true };
  }
  gmailValidator(control: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  ngOnInit() {
    this.verificarConexionBD();
    this.loadUserData();
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.searchUsers();
      });
  }
  loadUserData() {
    this.serviceSession.getUserSession().subscribe(userSession => {
      if (userSession) {
        console.log('Sesión de usuario recuperada desde el servicio:', userSession);
        this.user = userSession;
        this.profileForm.patchValue({rut: this.user.rut,firstname: this.user.firstname,secondname: this.user.secondname,firstlastname: this.user.firstlastname,secondlastname: this.user.secondlastname,genderuser: this.user.genderuser,email: this.user.email,password: this.user.password,phone: this.user.phone
        });
      }
    });
  }
  onSubmit() {
    if (this.profileForm.valid) {
      const updatedUser = new Users(
        this.profileForm.value.rut,
        this.profileForm.value.firstname,
        this.profileForm.value.secondname,
        this.profileForm.value.firstlastname,
        this.profileForm.value.secondlastname,
        this.user?.imageuser,
        this.profileForm.value.genderuser,
        this.profileForm.value.email,
        this.profileForm.value.password,
        this.profileForm.value.phone,
        this.user?.idrol || 2
      );
      this.serviceBD.editUser(
        updatedUser.rut,
        updatedUser.firstname,
        updatedUser.secondname,
        updatedUser.firstlastname,
        updatedUser.secondlastname,
        updatedUser.genderuser,
        updatedUser.email,
        updatedUser.password,
        updatedUser.phone,
        updatedUser.idrol,
        updatedUser.imageuser
      ).then(() => {
        this.serviceSession.setUserSession(updatedUser).then(() => {
          console.log('Sesión de usuario actualizada en el servicio:', updatedUser);
          this.irPagina('/profile');
        }).catch(error => {
          console.error('Error actualizando la sesión del usuario en el servicio:', error);
        });
      }).catch(error => {
        this.serviceBD.presentAlert("Error", "Error al modificar el perfil: " + JSON.stringify(error));
      });

    } else {
      console.error('Formulario inválido');
    }
  }
  selectDataStatic() {
    this.serviceBD.fetchGenders().then(data => {
      this.genderAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo los géneros: ' + JSON.stringify(e));
    });
  }
  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
}
