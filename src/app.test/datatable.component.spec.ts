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

  const _setup = (bArrayDataSource: boolean = false, recordCount: number = 97, currentPage: number = 1) : void => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      providers: [
        {provide: StateManager, useValue: new StateManagerMock()}
      ],
      imports: [HttpModule]
    }).compileComponents();
    spyOn(TestBed.get(StateManager), "GetValue").and.callFake((id: string, property: string, defaultValue: any) : void => {
      return property === "CurrentPage" ? currentPage : defaultValue;
    });
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
    if (_component.Data.Rows.length > 0) {
      spyOn(_component.Data.Pager, "Go").and.callThrough();
      spyOn(_component.Data.Pager, "Advance").and.callThrough();
    }
  };

  const _teardown = () : void => {
    _component = null;
    _fixture = null;
    _data = null;
  };

  const _whenClickLeftDoubleArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[0].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickLeftArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[1].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickLeftEllipsis = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[2].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickPageNumber = (pageNumber: number) : void => {
    const index = pageNumber - _component.Data.Pager.FirstDisplayedPageNumber;
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[index + 3].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickRightEllipsis = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 3].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickRightArrow = () : void => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 4].nativeElement.click();
    _fixture.detectChanges();
  };

  const _whenClickRightDoubleArrow = () => {
    _fixture.debugElement.queryAll(By.css(".datatable-pager"))[_data.PageNumberDisplayCount + 5].nativeElement.click();
    _fixture.detectChanges();
  };

  const _thenInformation = (information: string) : void => {
    expect(_fixture.debugElement.queryAll(By.css("div"))[4].nativeElement.innerText.trim()).toBe(information);
  };

  const _thenPager = (pagerText: string) : void => {
    const pager = _fixture.debugElement.queryAll(By.css("div"))[7].nativeElement;
    if (pagerText == null) {
      expect(pager.getAttribute("hidden")).not.toBeNull();
    }
    else {
      expect(pager.getAttribute("hidden")).toBeNull();
      expect(pager.innerText.trim()).toBe(pagerText);
    }
  };

  const _thenPageNumberBold = (pageNumber: number) => {
    const index = pageNumber - _component.Data.Pager.FirstDisplayedPageNumber;
    expect(_fixture.debugElement.queryAll(By.css(".datatable-pager"))[index + 3].nativeElement.getAttribute("class")).toBe("datatable-pager datatable-pager-current");
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
    _thenInformation("Displaying 1-10 of 97 records");
  });

  it("should display correct information for single row", () => {
    _setup(true, 1);
    _thenInformation("Displaying 1 record");
  });

  it("should display correct information for single page", () => {
    _setup(false, 6);
    _thenInformation("Displaying 6 records");
  });

  it("should display correct information for last page", () => {
    _setup();
    _whenClickRightDoubleArrow();
    _thenInformation("Displaying 91-97 of 97 records");
  });

  it("should display correct information for single row on last page", () => {
    _setup(true, 91);
    _whenClickRightDoubleArrow();
    _thenInformation("Displaying record 91 of 91");
  });

  it("should hide grid and display message if empty", () => {
    _setup(true, 0);
    expect(_fixture.debugElement.queryAll(By.css("div")).length).toBe(3);
    expect(_fixture.nativeElement.innerText).toBe("No data");
  });

  it("should hide pager for single page", () => {
    _setup(false, 7);
    _thenPager(null);
  });

  it("should display pager for multiple pages", () => {
    _setup();
    _thenPager("<< < ... 12345678910 ... > >>");
  });

  it("should display correct page numbers", () => {
    _setup(false, 300, 30);
    _thenPager("<< < ... 21222324252627282930 ... > >>");
  });

  it("should make current page number bold", () => {
    _setup(false, 100, 3);
    _thenPageNumberBold(3);
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

    it("should make page 1 bold", () => {
      _setup(false, 100, 5);
      _whenClickLeftDoubleArrow();
      _thenPageNumberBold(1);
    });

    it("should update pager", () => {
      _setup(true, 200, 20);
      _whenClickLeftDoubleArrow();
      _thenPager("<< < ... 12345678910 ... > >>");
    });

  });

  describe("pager left arrow click", () => {
    
    it("should invoke Pager.Go with previous page number", () => {
      _setup();
      _whenClickLeftArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(0);
    });

    it("should make previous page number bold", () => {
      _setup(true, 100, 7);
      _whenClickLeftArrow();
      _thenPageNumberBold(6);
    });

    it("should update pager", () => {
      _setup(false, 200, 20);
      for(let i = 0; i < 10; i++) {
        _whenClickLeftArrow();
      }
      _thenPager("<< < ... 10111213141516171819 ... > >>");
    });

  });

  describe("pager left ellipsis click", () => {
    
    it("should invoke Pager.Advance with false", () => {
      _setup();
      _whenClickLeftEllipsis();
      expect(_component.Data.Pager.Advance).toHaveBeenCalledWith(false);
    });

    it("should make target page number bold", () => {
      _setup(true, 500, 40);
      _whenClickLeftEllipsis();
      _thenPageNumberBold(30);
    });

    it("should update pager", () => {
      _setup(true, 200, 20);
      _whenClickLeftEllipsis();
      _thenPager("<< < ... 12345678910 ... > >>");
    });

  });

  describe("pager page-number click", () => {
    
    it("should invoke Pager.Go with clicked page number", () => {
      _setup();
      _whenClickPageNumber(5);
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(5);
    });

    it("should make clicked page number bold", () => {
      _setup();
      _whenClickPageNumber(3);
      _thenPageNumberBold(3);
    });

  });

  describe("pager right ellipsis click", () => {
    
    it("should invoke Pager.Advance with true", () => {
      _setup();
      _whenClickRightEllipsis();
      expect(_component.Data.Pager.Advance).toHaveBeenCalledWith(true);
    });

    it("should make target page number bold", () => {
      _setup(true, 200);
      _whenClickRightEllipsis();
      _thenPageNumberBold(11);
    });

    it("should update pager", () => {
      _setup(false, 106);
      _whenClickRightEllipsis();
      _thenPager("<< < ... 234567891011 ... > >>");
    });

  });

  describe("pager right arrow click", () => {
    
    it("should invoke Pager.Go with next page number", () => {
      _setup();
      _whenClickRightArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(2);
    });

    it("should make next page number bold", () => {
      _setup();
      _whenClickRightArrow();
      _thenPageNumberBold(2);
    });

    it("should update pager", () => {
      _setup(false, 150);
      for(let i = 0; i < 10; i++) {
        _whenClickRightArrow();
      }
      _thenPager("<< < ... 234567891011 ... > >>");
    });

  });

  describe("pager right double-arrow click", () => {
    
    it("should invoke Pager.Go with last page number", () => {
      _setup();
      _whenClickRightDoubleArrow();
      expect(_component.Data.Pager.Go).toHaveBeenCalledWith(10);
    });

    it("should make last page number bold", () => {
      _setup();
      _whenClickRightDoubleArrow();
      _thenPageNumberBold(10);
    });

    it("should update pager", () => {
      _setup(false, 170);
      _whenClickRightDoubleArrow();
      _thenPager("<< < ... 891011121314151617 ... > >>");
    });

  });

});