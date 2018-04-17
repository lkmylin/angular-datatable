import { Component, OnInit } from "@angular/core";
import { TableDataService } from "../../services/tabledata.service";
import { DataTable } from "../../models/datatable";

@Component({
  selector: "app-datatable",
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.css"]
})
export class DatatableComponent implements OnInit {

  Data: DataTable;

  constructor(private _tableDataService: TableDataService) { }

  ngOnInit() {
    this._tableDataService.Get("table1", "../../../assets/demo/demo.json").subscribe(data => {
      this.Data = data;
    });
  }

}