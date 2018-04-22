import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StateManager } from "@lkmylin/angular-statemanager";
import { DataTableComponent } from "../app/components/datatable/datatable.component";
import { HttpModule, Http } from "@angular/http";
import { StateManagerMock } from "./mocks";
import { TestData } from "./testdata";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

describe("components/datatable", () => {

  let _component: DataTableComponent;
  let _fixture: ComponentFixture<DataTableComponent>;
  let _data: TestData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      providers: [
        {provide: StateManager, useValue: new StateManagerMock()}
      ],
      imports: [HttpModule]
    }).compileComponents();
    _data = new TestData(97);
    const http = TestBed.get(Http);
    const response = new Response();
    spyOn(response, "json").and.returnValue(_data.Rows);
    spyOn(http, "get").and.callFake(url => Observable.of(response));    
  }));

  beforeEach(() => {
    _fixture = TestBed.createComponent(DataTableComponent);
    _component = _fixture.componentInstance;
    _component.ID = "table1";
    _component.PageNumberDisplayCount = 10;
    _component.RowsPerPage = 10;
    _fixture.detectChanges();
  });

  it("should create", () => {
    expect(_component).toBeTruthy();
  });
});