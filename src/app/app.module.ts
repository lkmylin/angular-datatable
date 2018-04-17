import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { DatatableComponent } from "./components/datatable/datatable.component";
import { RootComponent } from "./components/root/root.component";
import { TableDataService } from "./services/tabledata.service";
import { CacheService } from "./services/cache.service";

@NgModule({
  declarations: [
    DatatableComponent,
    RootComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    {provide: "$window", useValue: window},
    TableDataService,
    CacheService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }