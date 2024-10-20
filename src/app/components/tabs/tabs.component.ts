import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {
  @Input() Productos: any;
  Usuarios: any;
  constructor( private router:Router, private activedRoute:ActivatedRoute){
  }
  ngOnInit() {}
  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }

}
