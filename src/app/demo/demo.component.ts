import { Component } from "@angular/core";

@Component({
  selector: "demo",
  template: `<div style="float:left;width:80%;margin:2% 0 0 2%;">
              <lkm-datatable tableid="demotable" datasource="assets/demo.json" [pagesize]="10" [pagerdisplaysize]="10">
              </lkm-datatable>
            </div>`
})
export class DemoComponent {

  constructor () { }

}