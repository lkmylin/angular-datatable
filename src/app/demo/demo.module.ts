import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { StateManagerModule, StateManager } from "@lkmylin/angular-statemanager";
import { DataTableModule } from "@lkmylin/angular-datatable";
import { DemoComponent } from "./demo.component";

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    StateManagerModule,
    DataTableModule    
  ],
  providers: [
    {provide: "window", useValue: window},
    StateManager
  ],
  bootstrap: [DemoComponent]
})
export class DemoModule { }