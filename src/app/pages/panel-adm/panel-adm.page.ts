import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-panel-adm',
  templateUrl: './panel-adm.page.html',
  styleUrls: ['./panel-adm.page.scss'],
})
export class PanelAdmPage implements OnInit {
  constructor( private router:Router, private activatedroute:ActivatedRoute) {
   }
  ngOnInit() {
  }
  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }
}
