import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StateManager } from "@lkmylin/angular-statemanager";
import { DataTableComponent } from "../app/components/datatable/datatable.component";
import { HttpModule, Http } from "@angular/http";
import { By } from "@angular/platform-browser";
import { StateManagerMock } from "./mocks";
import { TestData } from "./testdata";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

describe("components/datatable", () => {

  let _component: DataTableComponent = null;
  let _fixture: ComponentFixture<DataTableComponent> = null;
  let _data: TestData = null;

  const _setup = (bArrayDataSource: boolean = false, recordCount: number = 97) : void => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      providers: [
        {provide: StateManager, useValue: new StateManagerMock()}
      ],
      imports: [HttpModule]
    }).compileComponents();
    _data = new TestData(recordCount);
    _fixture = TestBed.createComponent(DataTableComponent);
    _component = _fixture.componentInstance;
    _component.ID = _data.ID;
    _component.PageNumberDisplayCount = _data.PageNumberDisplayCount;
    _component.RowsPerPage = _data.RowsPerPage;
    if (bArrayDataSource) {
      _component.DataSource = _data.Rows;
    }
    else {
      _component.DataSource = "some.url";
      const http = TestBed.get(Http);
      const response = new Response();
      spyOn(response, "json").and.returnValue(_data.Rows);
      spyOn(http, "get").and.callFake(url => Observable.of(response));
    }
    _fixture.detectChanges();
    spyOn(_component.Data.Pager, "Go");
    spyOn(_component.Data.Pager, "Advance");
  };

  const _teardown = () : void => {
    _component = null;
    _fixture = null;
    _data = null;
  };

  const _whenClickLeftDoubleArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[0].nativeElement.click();
  };

  const _whenClickLeftArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[1].nativeElement.click();
  };

  const _whenClickLeftEllipsis = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[2].nativeElement.click();
  };

  const _whenClickPageNumber = (pageNumber: number) : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[pageNumber + 2].nativeElement.click();
  };

  const _whenClickRightEllipsis = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 3].nativeElement.click();
  };

  const _whenClickRightArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 4].nativeElement.click();
  };

  const _whenClickRightDoubleArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 5].nativeElement.click();
  };

  afterEach(_teardown);

  it("should be instantiated from url", () => {
    _setup();
    expect(_component).toBeTruthy();
    expect(_component.Data).toBeTruthy();
  });

  it("should be instantiated from array", () => {
    _setup(true);
    expect(_component).toBeTruthy();
    expect(_component.Data).toBeTruthy();
  });

  it("should build rows", () => {
    _setup(true);
    expect(_fixture.debugElement.queryAll(By.css("tr")).length).toBe(_data.RowsPerPage + 1);
  });

  it("should display information", () => {
    _setup();
    expect(_fixture.debugElement.queryAll(By.css("div"))[4].nativeElement.innerText.trim()).toBe("Displaying 1-10 of 97 records");
  });

  it("should display pager", () => {
    _setup();
    expect(_fixture.debugElement.queryAll(By.css("div"))[7].nativeElement.innerText.trim()).toBe("<< < ... 12345678910 ... > >>");
  });

  it("should display column headers", () => {
    _setup();
    expect(_fixture.debugElement.queryAll(By.css("th")).length).toBe(_component.Data.Columns.length);
    _component.Data.Columns.forEach((column, index) => {
      expect(_fixture.debugElement.queryAll(By.css("th"))[index].nativeElement.innerText).toBe(column.ColumnID);
    });
  });

  it("should contain filter control", () => {
    _setup();
    expect(_fixture.debugElement.queryAll(By.css("input[type=text]")).length).toBe(1);
    expect(_fixture.debugElement.queryAll(By.css("select")).length).toBe(1);
    expect(_fixture.debugElement.queryAll(By.css("option")).length).toBe(_component.Data.Columns.length);
    _component.Data.Columns.forEach((column, index) => {
      expect(_fixture.debugElement.queryAll(By.css("option"))[index].nativeElement.innerText).toBe(column.ColumnID);
    });
  });

  describe("pager left double-arrow click", () => {
    
    it("should invoke Pager.Go with 1", () => {
      _setup();
      _whenClickLeftDoubleArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(1);
    });

  });

  describe("pager left arrow click", () => {
    
    it("should invoke Pager.Go with previous page number", () => {
      _setup();
      _whenClickLeftArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(0);
    });

  });

  describe("pager left ellipsis click", () => {
    
    it("should invoke Pager.Advance with false", () => {
      _setup();
      _whenClickLeftEllipsis();
      expect(_component.Data.Pager.Advance).toHaveBeenCalledWith(false);
    });

  });

  describe("pager page-number click", () => {
    
    it("should invoke Pager.Go with clicked page number", () => {
      _setup();
      _whenClickPageNumber(5);
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(5);
    });

  });

  describe("pager right ellipsis click", () => {
    
    it("should invoke Pager.Advance with true", () => {
      _setup();
      _whenClickRightEllipsis();
      expect(_component.Data.Pager.Advance).toHaveBeenCalledWith(true);
    });

  });

  describe("pager right arrow click", () => {
    
    it("should invoke Pager.Go with next page number", () => {
      _setup();
      _whenClickRightArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(2);
    });

  });

  describe("pager right double-arrow click", () => {
    
    it("should invoke Pager.Go with last page number", () => {
      _setup();
      _whenClickRightDoubleArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(10);
    });

  });

});