import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViaje } from '../../Modals/destino-viajes.model';
import { DestinoApiClient } from '../../Modals/destino-api-client.model';
import { Store} from '@ngrx/store';
import { AppState } from '../../app.module';
// import {ElegidoFavoritoAction, NuevoDestinoAction} from '../../Modals/destino-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
  providers: [ DestinoApiClient ]
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  //destinos: DestinoViaje[];

  updates: string[];


  constructor(public destinosApiClient: DestinoApiClient , private store: Store<AppState>) { 
    this.onItemAdded = new EventEmitter();
    this.updates = [];
/*
   this.store.select(state => state.destinos.favorito)
    .subscribe(d => {
      if(d != null){
        this.updates.push("Se ha elegido a " +  d.nombre);
      }
    }); */
  }


  ngOnInit(){
     this.store.select(state => state.destinos.favorito)
    .subscribe(d => {
    const f = d;
      if(f != null){
        this.updates.push("Se ha elegido a " +  f.nombre);
      }
    })
  }
  /*
  guardar(nombre:string, url:string):boolean {
    this.destinos.push(new DestinoViaje(nombre, url));
    //console.log(new DestinoViaje(nombre,url));
    //console.log(this.destinos);
    return false;
  }
  */
  agregado(d: DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
   // this.store.dispatch(new NuevoDestinoAction(d));
  }

  elegido(e: DestinoViaje){
    //desmarcar todos los demas en en array de elegidos
    //this.destinos.forEach(function (x) {x.setSelected(false); });
    //se marca el elegido
    //d.setSelected(true);
    
    this.destinosApiClient.elegir(e);
    // this.store.dispatch(new ElegidoFavoritoAction(e));


  }

}