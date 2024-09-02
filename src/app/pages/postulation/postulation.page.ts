import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-postulation',
  templateUrl: './postulation.page.html',
  styleUrls: ['./postulation.page.scss'],
})
export class PostulationPage implements OnInit {
  postulationForm: FormGroup;
  isToastOpen = false;
  toastMessage: string = '';
  Productos: any;

  constructor(private fb: FormBuilder, private router:Router, private activatedroute:ActivatedRoute) {
    this.postulationForm = this.fb.group({
      position: ['', Validators.required],
      comment: ['', Validators.required],
    });
    this.activatedroute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    });
   }
  ngOnInit(){}
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }

  onSubmit() {
    if (this.postulationForm.valid) {
      this.showToast('Exitosa postulación');
    } else {
      this.showToast('Te faltan campos por rellenar');
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }

}
