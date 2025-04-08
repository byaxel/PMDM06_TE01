import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadercomponentComponent } from './headercomponent/headercomponent.component';



@NgModule({
  declarations: [HeadercomponentComponent],
  imports: [
    CommonModule
  ],
  exports: [HeadercomponentComponent]
})
export class MycomponentsModule { }
