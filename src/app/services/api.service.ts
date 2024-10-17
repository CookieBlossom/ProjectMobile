import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpsOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*',
      'x-api-key': 'live_2iim2EOL3pf0osJvVHcxxvKUBxoLLl4SC0rdsp78qzjnaYcOYds7yZWnBMbXHueU'
    })
  }
  apiUrl = 'https://api.thecatapi.com';
  constructor( private http:HttpClient){}

  getImageRandom():Observable<any>{
    return(this.http.get(this.apiUrl+'/v1/images/search?limit=1').pipe(
      retry(3)
    ));
  }

}
