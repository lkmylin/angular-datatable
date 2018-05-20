import { TestBed } from "@angular/core/testing";
import { StateManagerMock } from "./mocks";
import { DataTable, DataTableCacheProperties } from "../app/models/datatable";
import { TestData } from "./testdata";
import { DataTablePager } from "../app/models/pager";

describe("models/pager", () => {

  const _cacheProperties = new DataTableCacheProperties();
  let _stateManager: StateManagerMock = null;
  let _table: DataTable = null;
  let _pager: DataTablePager = null;
  let _data: TestData = null;

  const _setup = (recordCount: number = 10, spy: () => void = null) => {
    _data = new TestData(recordCount);
    _stateManager = new StateManagerMock();
    spyOn(_stateManager, "SetValue");
    if (spy) spy();
    _table = new DataTable(_data.ID, _data.Rows, _stateManager, _data.RowsPerPage, _data.PageNumberDisplayCount);
    spyOn(_table, "SetDisplay");
    _pager = _table.Pager;
  };

  const _teardown = () => {
    _stateManager = null;
    _table = null;
    _pager = null;
    _data = null;
  };

  const _givenCacheValues = (firstDisplayedPageNumber: number, currentPage: number) => {
    spyOn(_stateManager, "GetValue").and.callFake((id: string, property: string, defaultValue: any) => {
      if (property === _cacheProperties.CurrentPage) return currentPage;
      if (property === _cacheProperties.FirstDisplayedPageNumber) return firstDisplayedPageNumber;
      return defaultValue;
    });
  };

  afterEach(_teardown);

  it("should be instantiated", () => {
    _setup();
    expect(_pager).toBeTruthy();
  });

  it("should start at page 1 by default", () => {
    _setup(100);
    expect(_pager.CurrentPage).toBe(1);
  });

  it("should display correct page numbers", () => {
    _setup(120);
    expect(_pager.DisplayedPageNumbers).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });

  it("should get current page from cache", () => {
    _setup(100, () => _givenCacheValues(1, 3));
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.CurrentPage, 1);
    expect(_pager.CurrentPage).toBe(3);
  });

  it("should get first page from cache", () => {
    _setup(300, () => _givenCacheValues(3, 7));
    expect(_stateManager.GetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FirstDisplayedPageNumber, 1);
    expect(_pager.FirstDisplayedPageNumber).toBe(3);
  });

  it("should default first and current page to 1 if values in cache don't make sense", () => {
    _setup(10, () => _givenCacheValues(100, 101));
    expect(_pager.CurrentPage).toBe(1);
    expect(_pager.FirstDisplayedPageNumber).toBe(1);
  });

  it("should set correct display row indices", () => {
    _setup(50, () => _givenCacheValues(1, 4));
    expect(_pager.DisplayRowsStartIndex).toBe(30);
    expect(_pager.DisplayRowsEndIndex).toBe(39);
  });

  it("should set correct display row indices at end for odd number of rows", () => {
    _setup(57, () => _givenCacheValues(1, 6));
    expect(_pager.DisplayRowsStartIndex).toBe(50);
    expect(_pager.DisplayRowsEndIndex).toBe(56);
  });

  it("should calculate first page in pager display if necessary", () => {
    _setup(400, () => _givenCacheValues(1, 40));
    expect(_pager.FirstDisplayedPageNumber).toBe(31);
  });

  describe("Go", () => {

    const _whenGo = (page: number) => {
      _pager.Go(page);
    };

    it("should go to page", () => {
      _setup(100);
      _whenGo(3);
      expect(_pager.CurrentPage).toBe(3);
    });

    it("should stay on same page if target page number doesn't make sense", () => {
      _setup(100);
      _whenGo(-1);
      expect(_pager.CurrentPage).toBe(1);
      _whenGo(1000);
      expect(_pager.CurrentPage).toBe(1);
    });

    it("should cache new values", () => {
      _setup(100);
      _whenGo(7);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.CurrentPage, 7);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FirstDisplayedPageNumber, 1);
    });

    it("should update page number display", () => {
      _setup(300);
      _whenGo(15);
      expect(_pager.DisplayedPageNumbers).toEqual([6,7,8,9,10,11,12,13,14,15]);
    });

    it("should call the parent's SetDisplay method", () => {
      _setup(50);
      _whenGo(3);
      expect(_pager.Parent.SetDisplay).toHaveBeenCalled();
    });

  });

  describe("Advance", () => {

    const _whenAdvance = (bForward: boolean) => {
      _pager.Advance(bForward);
    };

    it("should advance the correct number of pages", () => {
      _setup(300);
      _whenAdvance(true);
      expect(_pager.CurrentPage).toBe(11);
      expect(_pager.FirstDisplayedPageNumber).toBe(11);
    });

    it("should move back the correct number of pages", () => {
      _setup(500, () => _givenCacheValues(31, 35));
      _whenAdvance(false);
      expect(_pager.CurrentPage).toBe(30);
      expect(_pager.DisplayedPageNumbers).toEqual([21,22,23,24,25,26,27,28,29,30]);
    });

    it("should stay on same page if advancing doesn't make sense", () => {
      _setup(100);
      _whenAdvance(true);
      expect(_pager.CurrentPage).toBe(1);
      _whenAdvance(false);
      expect(_pager.CurrentPage).toBe(1);
    });

    it("should update page number display", () => {
      _setup(156);
      _whenAdvance(true);
      expect(_pager.DisplayedPageNumbers).toEqual([7,8,9,10,11,12,13,14,15,16]);
    });

    it("should cache new values", () => {
      _setup(200);
      _whenAdvance(true);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.CurrentPage, 11);
      expect(_stateManager.SetValue).toHaveBeenCalledWith(_data.ID, _cacheProperties.FirstDisplayedPageNumber, 11);
    });

    it("should call parent's SetDisplay method", () => {
      _setup(150);
      _whenAdvance(true);
      expect(_pager.Parent.SetDisplay).toHaveBeenCalled();
    });

  });

});