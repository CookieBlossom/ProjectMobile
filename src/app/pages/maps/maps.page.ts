import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map!: GoogleMap;
  constructor() { }
  ngOnInit() {
    const mapRef = document.getElementById('map');
    this.initMap(mapRef);
  }
  async initMap(mapRef: any){
    this.map = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: mapRef, // reference to the capacitor-google-map element
      apiKey: 'AIzaSyCXpJn6I3ItzJuLNsVkx0b13PkJ7fVYvj8', // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: -33.36600094592272,
          lng: -70.67832996080507,
        },
        zoom: 15, // The initial zoom level to be rendered by the map
      },
    });
  }
}
