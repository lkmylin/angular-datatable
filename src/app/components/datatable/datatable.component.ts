import { Component, OnInit, Input } from "@angular/core";
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
export class DataTableComponent implements OnInit {

  @Input("datasource") _dataSourceUrl: string;
  @Input("tableid") ID: string;
  @Input("pagesize") RowsPerPage: number = 10;
  @Input("pagerdisplaysize") PageNumberDisplayCount: number = 10;
  Data: DataTable;

  constructor(private _http: Http, private _stateManager: StateManager) { }

  ngOnInit() {
    const context = this;
    context._http.get(context._dataSourceUrl).map<Response, Array<any>>(response => response.json())
      .catch<Array<any>, Array<any>>(error => {
        console.log(error);
        return null;
      }).subscribe(data => {
        context.Data = new DataTable(context.ID, data, this._stateManager, context.RowsPerPage, context.PageNumberDisplayCount);
      });
  }

}