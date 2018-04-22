import { TestBed } from "@angular/core/testing";
import { StateManagerMock } from "./mocks";
import { DataTable } from "../app/models/datatable";
import { TestData } from "./testdata";

describe("models/datatable", () => {

  let _stateManager: StateManagerMock = null;
  let _table: DataTable = null;
  let _data: TestData = null;

  beforeEach(() => {
    _data = new TestData(97);
    _stateManager = new StateManagerMock();
    _table = new DataTable("test_table", _data.Rows, _stateManager, 10, 10);
  });

  it("should be instantiated", () => {
    expect(_table).toBeTruthy();
  });

});