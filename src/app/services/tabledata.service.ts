import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { DataTable } from "../models/datatable";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { CacheService } from "./cache.service";

@Injectable()
export class TableDataService {

  Get: (id: string, url: string) => Observable<DataTable> = (id: string, url: string) : Observable<DataTable> => {
    const context = this;
    return context._http.get(url).map(res => new DataTable(id, res.json(), context._cacheService)).catch<DataTable, DataTable>(error => {
      console.log(error);
      return null;
    });
  };

  constructor(private _http: Http, private _cacheService: CacheService) { }

}