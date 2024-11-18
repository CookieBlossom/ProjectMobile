import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap } from '@capacitor/google-maps';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map!: GoogleMap;
  constructor(private route:Router) { }
  ngOnInit() {
    const mapRef = document.getElementById('map');
    this.initMap(mapRef);
  }
  async initMap(mapRef: any){
    this.map = await GoogleMap.create({
      id: 'my-map',
      element: mapRef,
      apiKey: 'AIzaSyCXpJn6I3ItzJuLNsVkx0b13PkJ7fVYvj8',
      config: {
        center: {
          lat: -33.36600094592272,
          lng: -70.67832996080507,
        },
        zoom: 15,
      },
    });
  }
  irPagina(ruta: string) {
    this.route.navigate([ruta]);
  }
}
