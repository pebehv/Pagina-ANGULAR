/* import { Component } from '@angular/core';
import { TranslateService} from '@ngx-translate/core
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-wishlist';
}
*/

import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-wishlist ';
  time = new Observable(observer =>{
  	setInterval(() => observer.next(new Date().toString() ),1000 );
      return null;
  });

  constructor(public translate: TranslateService){
    console.log('***************** get translation');
    translate.getTranslation('en').subscribe(x => console.log( 'x: ' + JSON.stringify(x)));
    translate.setDefaultLang('es');
  }
  detinoAgregado(d){
  //alert(d.nombre);
  }
}

