import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTableComponent } from "./components/datatable/datatable.component";

@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }