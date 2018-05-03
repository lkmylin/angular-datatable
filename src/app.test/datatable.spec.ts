import { TestBed } from "@angular/core/testing";
import { StateManagerMock } from "./mocks";
import { DataTable, DataTableColumn, DataTableCacheProperties } from "../app/models/datatable";
import { TestData } from "./testdata";

describe("models/datatable", () => {

  const _cacheProperties = new DataTableCacheProperties();
  let _stateManager: StateManagerMock = null;
  let _table: DataTable = null;
  let _data: TestData = null;

  const _setup = (recordCount: number = 10, spy: () => void = null) => {
    _data = new TestData(recordCount);
    _stateManager = new StateManagerMock();
    spyOn(_stateManager, "SetValue");
    if (spy) spy();
    const rows = recordCount < 0 ? [] : _data.Rows;
    if (rows.length === 0) {
      _data.SortFriendlyRows.forEach(row => rows.push(row));
    }
    _table = new DataTable(_data.ID, rows, _stateManager, _data.RowsPerPage, _data.PageNumberDisplayCount);
  };

  const _teardown = () => {
    _stateManager = null;
    _table = null;
    _data = null;
  };

  const _givenCacheValues = (firstDisplayedPageNumber: number, currentPage: number, filterText: string = void 0, filterColumn: string = void 0, sortColumn: string = void 0, columns: any[] = void 0) => {
    spyOn(_stateManager, "GetValue").and.callFake((id: string, property: string, defaultValue: any) => {
      if (property === _cacheProperties.CurrentPage) return currentPage;
      if (property === _cacheProperties.FirstDisplayedPageNumber) return firstDisplayedPageNumber;
      if (property === _cacheProperties.FilterText) return typeof filterText === "undefined" ? defaultValue : filterText;
      if (property === _cacheProperties.FilterColumn) return typeof filterColumn === "undefined" ? defaultValue : filterColumn;
      if (property === _cacheProperties.SortColumn) return typeof sortColumn === "undefined" ? defaultValue : sortColumn;
      if (columns && property.endsWith(_cacheProperties.SortOrder)) {
        for (let i = 0; i < columns.length; i++) {
          if (property === columns[i].ColumnID + _cacheProperties.SortOrder) return columns[i].SortOrder;
        }
      }
      return defaultValue;
    });
  }

  const _whenFilter = (filterColumn: string, filterText: string) => {
    _table.Update(filterColumn, filterText, null);
  };

  const _whenSort = (column: DataTableColumn) => {
    _table.Update(null, null, column);
  };

  const _thenAscending = () => {
    expect(_table.DisplayedRows).toEqual([
      _data.SortFriendlyRows[3],
      _data.SortFriendlyRows[7],
      _data.SortFriendlyRows[5],
      _data.SortFriendlyRows[1],
      _data.SortFriendlyRows[9],
      _data.SortFriendlyRows[4],
      _data.SortFriendlyRows[0],
      _data.SortFriendlyRows[2],
      _data.SortFriendlyRows[8],
      _data.SortFriendlyRows[6]
    ]);
  };

  const _thenDescending = () => {
    expect(_table.DisplayedRows).toEqual([
      _data.SortFriendlyRows[6],
      _data.SortFriendlyRows[8],
      _data.SortFriendlyRows[2],
      _data.SortFriendlyRows[0],
      _data.SortFriendlyRows[4],
      _data.SortFriendlyRows[9],
      _data.SortFriendlyRows[1],
      _data.SortFriendlyRows[5],
      _data.SortFriendlyRows[7],
      _data.SortFriendlyRows[3]
    ]);
  };

  afterEach(_teardown);

  it("should be instantiated", () => {
    _setup();
    expect(_table).toBeTruthy();
  });

  it("should set columns property", () => {
    _setup();
    expect(_table.Columns).toEqual([
      {ColumnID: "Column 1", SortOrder: 1},
      {ColumnID: "Column 2", SortOrder: 1},
      {ColumnID: "Column3", SortOrder: 1}
    ]);
  });

  it("should get cached values", () => {
    _setup(100, () => _givenCacheValues(1, 1, "test", "Column 2", "Column3", [{ColumnID: "Column 2", SortOrder: -1}]));
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FilterText, "");
    expect(_table.FilterText).toBe("test");
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FilterColumn, "Column 1");
    expect(_table.FilterColumn).toBe("Column 2");
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.SortColumn, "Column 1");
    expect(_table.SortColumn).toEqual(_table.Columns[2]);
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, "Column 1" + _cacheProperties.SortOrder, 1);
    expect(_table.Columns[0].SortOrder).toBe(1);
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, "Column 2" + _cacheProperties.SortOrder, 1);
    expect(_table.Columns[1].SortOrder).toBe(-1);
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, "Column3" + _cacheProperties.SortOrder, 1);
    expect(_table.Columns[2].SortOrder).toBe(1);
  });

  it("should display correct rows", () => {
    _setup(100, () => _givenCacheValues(1, 7));
    expect(_table.DisplayedRows).toEqual([
      _data.Rows[60],
      _data.Rows[61],
      _data.Rows[62],
      _data.Rows[63],
      _data.Rows[64],
      _data.Rows[65],
      _data.Rows[66],
      _data.Rows[67],
      _data.Rows[68],
      _data.Rows[69]
    ]);
  });

  it("should sort rows by column 1 in ascending order by default", () => {
    _setup(-1);
    _thenAscending();
  });

  it("should sort rows by cached sort column and sort order", () => {
    _setup(-1, () => _givenCacheValues(1, 1, undefined, undefined, "Column3", [{ColumnID: "Column3", SortOrder: -1}]));
    _thenDescending();
  });

  it("should apply cached filter", () => {
    _setup(200, () => _givenCacheValues(1, 1, "33"));
    expect(_table.DisplayedRows).toEqual([
      {"Column 1": "Column 1 Value 133", "Column 2": "Column 2 Value 133", "Column3": "Column 3 Value 133"},
      {"Column 1": "Column 1 Value 33", "Column 2": "Column 2 Value 33", "Column3": "Column 3 Value 33"}
    ]);
  });

  it("should not set cache", () => {
    _setup();
    expect(_stateManager.SetValue).not.toHaveBeenCalled();
  });

  describe("Update", () => {

    it("should filter by selected column", () => {
      _setup(50);
      _whenFilter("Column 2", "Column 2 Value 33");
      expect(_table.DisplayedRows).toEqual([{"Column 1": "Column 1 Value 33", "Column 2": "Column 2 Value 33", "Column3": "Column 3 Value 33"}]);
    });

    it("should cache filter values", () => {
      _setup();
      _whenFilter("Column3", "Value 7");
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FilterColumn, "Column3");
      expect(_stateManager.SetValue).toHaveBeenCalled();
    });

    it("should convert filter text to lower case", () => {
      _setup();
      _whenFilter("Column3", "Value 7");
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FilterText, "value 7");
    });

    it("should sort rows by specified column", () => {
      _setup(-1);
      _thenAscending();
      _whenSort(_table.Columns[2]);
      _thenDescending();
      _whenSort(_table.Columns[2]);
      _thenAscending();
    });

    it("should cache sort values", () => {
      _setup(-1);
      _whenSort(_table.Columns[1]);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.SortColumn, _table.Columns[1].ColumnID);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _table.Columns[1].ColumnID + _cacheProperties.SortOrder, -1);
    });

  });

});