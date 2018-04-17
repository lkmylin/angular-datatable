import { TestBed } from "@angular/core/testing";
import { CacheService } from "../services/cache.service";
import { WindowMock } from "../services/cache.service.spec";
import { DataTable } from "./datatable";

describe("models/datatable", () => {

  let _cacheService: CacheService = null;
  let _table: DataTable = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: "$window", useValue: new WindowMock({})},
        CacheService
      ]
    });
    _cacheService = TestBed.get(CacheService);
    _table = new DataTable("test_table", TestData, _cacheService, 10, 10);
  });

  it("should be instantiated", () => {
    expect(_table).toBeTruthy();
  });

});

export const TestData: Array<any> = [
  {Column1: "Column1Value1", Column2: "Column2Value1", Column3: "Column3Value1"},
  {Column1: "Column1Value2", Column2: "Column2Value2", Column3: "Column3Value2"},
  {Column1: "Column1Value3", Column2: "Column2Value3", Column3: "Column3Value3"},
  {Column1: "Column1Value4", Column2: "Column2Value4", Column3: "Column3Value4"},
  {Column1: "Column1Value5", Column2: "Column2Value5", Column3: "Column3Value5"}
];