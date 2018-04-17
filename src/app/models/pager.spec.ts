import { TestBed } from "@angular/core/testing";
import { CacheService } from "../services/cache.service";
import { WindowMock } from "../services/cache.service.spec";
import { DataTable } from "./datatable";
import { TestData } from "./datatable.spec";
import { DataTablePager } from "./pager";

describe("models/pager", () => {

  let _cacheService: CacheService = null;
  let _table: DataTable = null;
  let _pager: DataTablePager = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: "$window", useValue: new WindowMock({})},
        CacheService
      ]
    });
    _cacheService = TestBed.get(CacheService);
    _table = new DataTable("test_table", TestData, _cacheService, 10, 10);
    _pager = _table.Pager;
  });

  it("should be instantiated", () => {
    expect(_pager).toBeTruthy();
  });

});