import { Component } from '@angular/core';
import {Router} from "@angular/router";
//import "../../node_modules/angular-calendar/css/angular-calendar.css";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {

  }
}
