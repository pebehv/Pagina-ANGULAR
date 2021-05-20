import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
//importando ruteo
import { RouterModule, Routes } from '@angular/router';
//importando formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';



import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';

import {   DestinoViajesState,
          intializeDestinoViajesState,
          reducerDestinosViajes,
          DestinoViajesEffects ,
          InitMyDataAction } from './Modals/destino-viajes-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';

import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';

import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';

import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';

import { HttpClientModule } from '@angular/common/http';
import { Store} from '@ngrx/store';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import Dexie from 'dexie';
// import { translateService} from '@ngx-trnslate/core';

import {TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import {BrowserAnimationsModule } from '@ngular/platform-browser/animations';
import {   DestinoViaje } from './Modals/destino-viajes.model';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';
//app config
export interface AppConfig {
  apiEndpoint: String;
}
const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

//fin app config


export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main', component: VuelosMainComponent},
  { path: 'mas-info', component: VuelosMasInfoComponent},
  { path: ':id', component: VuelosDetalleComponent},

];




// definiendo direcciones del nav

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: ListaDestinosComponent},
  { path: 'destino/:id', component: DestinoDetalleComponent},
  { path: 'login', component: LoginComponent},

  { 
  path: 'protected',
   component: ProtectedComponent,
   canActivate: [UsuarioLogueadoGuard]
   },

  {
    path: 'vuelos',
    component: VuelosComponent,
    canActivate: [UsuarioLogueadoGuard ],
    children: childrenRoutesVuelos

  }
];

//redux init
export interface AppState{
    destinos: DestinoViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const reducersInitialState = {
  destinos: intializeDestinoViajesState()
};

// redux fin init
//app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.intializeDestinosViajesState();

}
@Injectable()
class AppLoadService{
  constructor(private store: Store<AppState>, private http: HttpClient){}
  async intializeDestinosViajesState(): Promise<any>{
    const headers: HttpHeaders = new HttpHeaders({'x-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers});
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

//end app init

//dexie db
/*
@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie{
  destinos: Dexie.Table<DestinoViaje, number>;
  constructor(){
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id, nombre, imagenUrl',
    });
  }
} 
*/

export class Translation{
  constructor( public id: number, public lang: string, public key: string, public value: string){}
}

@Injectable({
  providedIn: 'root'
})

export class MyDatabase extends Dexie{
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor(){
  super('MyDatabase');
  this.version(1).stores({
    destinos: '++id, nombre, imagenUrl',

    });
      this.version(2).stores({
        destinos: '++id, nombre, imagenUrl',
        translations: '++id, lang, key, value'
      });
  }
}


export const db = new MyDatabase ();

//end dexie db

// ini

class TranslationLoader implements TranslateLoader{
  constructor(private http: HttpClient){}

  getTranslation(lang: string ): Observable<any> {
    const promise = db.translations
              .where('lang')
              .equals(lang)
              .toArray()
              .then( results => {
                        if( results.length === 0){
                          return this.http
                            .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang=' + lang)
                            .toPromise()
                            .then(apiResults => {
                              db.translations.bulkAdd(apiResults);
                              return apiResults;
                            });
                          }
                          return results;
                      }).then((traducciones) =>{
                        console.log('traducciones cargadas');
                        console.log('traducciones');
                        return traducciones;

                      }).then ((traducciones) => {
                        return traducciones.map((t) =>({[t.key]: t.value}));
                      });

    return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}
function HttpLoaderFactory(http: HttpClient){
  return new TranslationLoader(http);
}
//End ini


@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
  
    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,

    VuelosDetalleComponent,

    EspiameDirective,

    TrackearClickDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes), //registrando las rutas
    FormsModule, //agregar un formulario
    ReactiveFormsModule,

    NgRxStoreModule.forRoot(reducers, { initialState: reducersInitialState,
    BrowserAnimationsmodule,

    runtimeChecks:{

    strictStateImmutability: false,

    strictActionImmutability: false, 
    }
    }),
    EffectsModule.forRoot([DestinoViajesEffects]),
    ReservasModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
     NgxMapboxGLModule

  ],
  providers: [
     AuthService, UsuarioLogueadoGuard,
     {provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
     AppLoadService, { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
     MyDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }