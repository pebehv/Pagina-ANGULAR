import { Component, OnInit } from '@angular/core';
import { DestinoApiClient } from './../../Modals/destino-api-client.model';
import { DestinoViaje } from './../../Modals/destino-viajes.model';
import { ActivatedRoute } from '@angular/router';

 /*
class DestinoApiClientViejo{
	getById(id: String): DestinoViaje{
		console.log('LLamado por la clase vieja' );
		return null;
	}
}

interface AppConfig{
	apiEndpoint: string;
}

const APP_CONFIG_VALUE: AppConfig ={
	apiEndpoint: 'mi_api.com'
};

const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

@Injectable()
class DestinoApiClientDecorated extends DestinoApiClient{
	constructor(@Inject(APP_CONFIG) private config: AppConfig, store: Store<AppState> ){
		super(store);
	}
	getById(id: string): DestinoViaje{
		console.log('llamado por la class decorada');
		console.log('config'+ this.config.apiEndpoint);
		return super.getById(id);
	}
}
*/

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  //providers: [DestinoApiClient {providers: DestinoApiClientViejo, use Existing: DestinoApiClient}]
/*
  providers: [
  	DestinoApiClient
  	{provide: APP_CONFIG, useValue: APP_CONFIG_VALUE},
  	{provide: DestinoApiClient, useClass: DestinoApiClientDecorated},
  	{provide: DestinoApiClientViejo, useExisting: DestinoApiClient}
  ] */
  providers: [ DestinoApiClient ]

})


/*
export class DestinoDetalleComponent implements OnInit {
	destino: DestinoViaje;

  constructor( private route: ActivatedRoute, public destinosApiClient: DestinoApiClient) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.destino = this.destinosApiClient.getById(id);
  }

}
*/
export class DestinoDetalleComponent implements OnInit{
  destino: DestinoViaje;
  style = {
    sources: {
      world: {
        type: 'geojson' ,
        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'     
      }
    },
    version: 8,
    layers:[{
      'idi': 'countries',
      'type': 'fill',
      'source': 'world',
      'layout': {},
      'paint': {
        'fill-color': '#6F788A'
      }
    }]
  };
  constructor(private route: ActivatedRoute, private destinosApiClient: DestinoApiClient){}

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    this.destino = this.destinosApiClient.getById(id);
    }

  
}