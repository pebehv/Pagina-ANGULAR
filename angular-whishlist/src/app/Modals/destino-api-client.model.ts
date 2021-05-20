import { DestinoViaje } from './destino-viajes.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store} from '@ngrx/store';

import {  Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppState, AppConfig, APP_CONFIG, MyDatabase, db } from 'src/app/app.module';

import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destino-viajes-state.model';
import Dexie from 'dexie';
@Injectable ()
export class DestinoApiClient {
  destinos: DestinoViaje[] = [];
  // current:  Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);
/*
  constructor() {
       this.destinos = [];
  } 
  */
/*
    constructor(private store: Store<AppState>) {
        this.store
          .select(state => state.destinos)
          .subscribe((data) => {
              console.log('destinos sub store');
              console.log(data);
              this. destinos = data.items;
          });
        this.store
          .subscribe((data) => {
              console.log('all store');
              console.log(data);
          });
    } 
    
  add(d: DestinoViaje){
    this.destinos.push(d);
  }

  getAll(): DestinoViaje[] {
    return this.destinos;
  
   }
  
   
   getById( id: String): DestinoViaje {
    return this.destinos.filter(function(d) {return d.id.toString() === id;})[0];
   } 
   
  
   elegir(d: DestinoViaje){
   this.destinos.forEach(x => x.setSelected(false));
   d.setSelected(true);
   this.current.next(d);
   }

   subscribeOnChange(fn){
   this.current.subscribe(fn);
   }

   */

  constructor( private store: Store<AppState>, @Inject(forwardRef(()=> APP_CONFIG)) private config: AppConfig, private http: HttpClient ){

    this.store
      .select(state => state.destinos)
      .subscribe((data) => {
          console.log('destinos sub store');
          console.log(data);
          this. destinos = data.items;
      });
    this.store
      .subscribe((data) => {
          console.log('all store');
          console.log(data);
      });
  }

    add(d: DestinoViaje){
      const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
      const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', { nuevo: d.nombre}, {headers: headers});
      this. http.request(req).subscribe((data: HttpResponse<{}>) => {
        if(data.status === 200){
          this.store.dispatch(new NuevoDestinoAction(d));
          const myDb = db;
          myDb.destinos.add(d);
          console.log('destinos de la db');
          myDb.destinos.toArray().then(destinos => console.log(destinos));
        }
      });
    }
    getById( id: String): DestinoViaje {
        return this.destinos.filter(function(d) {return d.id.toString() === id;})[0];
       } 
    getAll(): DestinoViaje[] {
        return this.destinos;
    
     }
     elegir(d: DestinoViaje){
     this.destinos.forEach(x => x.setSelected(false));
     d.setSelected(true);
     //this.store.dispatch(new ElegidoFavoritoAction(d));
     //this.current.next(d);
     }
  
}
