import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DatatableComponent } from "./datatable.component";
import { WindowMock } from "../../services/cache.service.spec";
import { CacheService } from "../../services/cache.service";
import { TableDataService } from "../../services/tabledata.service";
import { HttpModule } from "@angular/http";

describe("components/datatable", () => {
  let component: DatatableComponent;
  let fixture: ComponentFixture<DatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableComponent ],
      providers: [
        {provide: "$window", useValue: new WindowMock({})},
        CacheService,
        TableDataService
      ],
      imports: [HttpModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});