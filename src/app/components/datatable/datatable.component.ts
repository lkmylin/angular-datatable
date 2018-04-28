import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Http, Response } from "@angular/http";
import { StateManager } from "@lkmylin/angular-statemanager";
import { DataTable } from "../../models/datatable";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Component({
  selector: "lkm-datatable",
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.css"]
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input("datasource") DataSource: any;
  @Input("tableid") ID: string;
  @Input("pagesize") RowsPerPage: number = 10;
  @Input("pagerdisplaysize") PageNumberDisplayCount: number = 10;
  Data: DataTable;

  private GetDataTable(data: Array<any>) : DataTable {
    return new DataTable(this.ID, data, this._stateManager, this.RowsPerPage, this.PageNumberDisplayCount);
  };

  constructor(private _http: Http, private _stateManager: StateManager) { }

  ngOnInit() {
    const context = this;
    if (typeof context.DataSource === "undefined") return;
    if (typeof context.DataSource === "string") {
      context._http.get(context.DataSource).map<Response, Array<any>>(response => response.json())
        .catch<Array<any>, Array<any>>(error => {
          console.log(error);
          return null;
        }).subscribe(data => {
          context.Data = context.GetDataTable(data);
        });
    }
    else {
      context.Data = this.GetDataTable(context.DataSource);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.DataSource && typeof changes.DataSource.currentValue === "object") {
      this.Data = this.GetDataTable(changes.DataSource.currentValue);
    }    
  }

}