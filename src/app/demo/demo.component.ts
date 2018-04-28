import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";

@Component({
  selector: "demo",
  template: `<div style="float:left;width:80%;margin:2% 0 0 2%;">
              <lkm-datatable tableid="demotable" [datasource]="Data" [pagesize]="10" [pagerdisplaysize]="10">
                <span>Demo Data Table</span>
              </lkm-datatable>
            </div>`
})
export class DemoComponent implements OnInit {

  Data: any[];

  constructor (private _http: Http) { }

  ngOnInit() {
    const context = this;
    context._http.get("assets/demo.json").map(res => res.json()).subscribe(data => context.Data = data);
  }

}