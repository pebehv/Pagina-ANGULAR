import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {DestinoViaje} from './destino-viajes.model';
import { HttpClientModule } from '@angular/common/http';

//ESTADO
export interface DestinoViajesState{
	items: DestinoViaje[];
	loading: boolean;
	favorito: DestinoViaje;
}

export function intializeDestinoViajesState(){
  return{
    items: [],
    loading: false,
    favorito: null
  };
}

//ACCIONES
export enum DestinoViajesActionTypes{
	NUEVO_DESTINO = '[Destino Viajes] Nuevo',
	ELEGIDO_FAVORITO = '[Destino Viajes] Favorito',
  VOTE_UP = '[Destino Viajes] vote Up',
  VOTE_DOWN = '[Destino Viajes] vote Down', 
  INIT_MY_DATA = '[ Destino Viajes] Init My Data '
}

export class NuevoDestinoAction implements Action {
	type = DestinoViajesActionTypes.NUEVO_DESTINO;
	constructor(public destino: DestinoViaje){}
}

export class ElegidoFavoritoAction implements Action{
	type = DestinoViajesActionTypes.ELEGIDO_FAVORITO;
	constructor(public destino: DestinoViaje){}
}

export class VoteUpAction implements Action{
  type = DestinoViajesActionTypes.VOTE_UP ;
  constructor(public destino: DestinoViaje){}
}

export class VoteDownAction implements Action{
  type = DestinoViajesActionTypes.VOTE_DOWN;
  constructor(public destino: DestinoViaje){}
}

export class InitMyDataAction implements Action{
  type = DestinoViajesActionTypes.INIT_MY_DATA;
  constructor(public destino: string[]){}
}

export type DestinoViajesActions = NuevoDestinoAction | ElegidoFavoritoAction | VoteUpAction | VoteDownAction | InitMyDataAction;

// REDUCERS
export function reducerDestinosViajes(
  state: DestinoViajesState,
  action: DestinoViajesActions
): DestinoViajesState {
  switch (action.type) {

    case DestinoViajesActionTypes.INIT_MY_DATA: {

      const destinos: string[] = (action as InitMyDataAction).destino;
    
      return {
        ...state,
        items: destinos.map((d) => new DestinoViaje(d, ''))
      };
    }


    case DestinoViajesActionTypes.NUEVO_DESTINO:{
    	return{
    		...state,
    		items: [...state.items, (action as NuevoDestinoAction).destino ]
    	};
    }
    case DestinoViajesActionTypes.ELEGIDO_FAVORITO: {
        state.items.forEach(x => x.setSelected(false));
        const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
        fav.setSelected(true);
        return {
          ...state,
          favorito: fav
        };
    }


    case DestinoViajesActionTypes.VOTE_UP: {

        const d: DestinoViaje = (action as VoteUpAction).destino;
        d.voteUp();
        return {
          ...state
        };
    }

    case DestinoViajesActionTypes.VOTE_DOWN: {

        const d: DestinoViaje = (action as VoteDownAction).destino;
        d.voteDown();
        return {
          ...state
        };
    }
  }
  return state;
}

// EFFECTS
@Injectable()
export class DestinoViajesEffects {
  @Effect()
  nuevoAgregado$: Observable<Action> = this.actions$.pipe(
    ofType(DestinoViajesActionTypes.NUEVO_DESTINO),
    map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino))
  );

  constructor(private actions$: Actions) {}
}