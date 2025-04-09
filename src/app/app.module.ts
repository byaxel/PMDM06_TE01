import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

const firebaseConfig = {
  apiKey: "AIzaSyABGLdOc_N_jbDnb3bNtlEVHTdQviKIpVI",
  authDomain: "pmdm06-face8.firebaseapp.com",
  projectId: "pmdm06-face8",
  storageBucket: "pmdm06-face8.firebasestorage.app",
  messagingSenderId: "69991948855",
  appId: "1:69991948855:web:bbfaef843e465476cb95b2"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
