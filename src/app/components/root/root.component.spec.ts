import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RootComponent } from "./root.component";
import { DatatableComponent } from "../datatable/datatable.component";
import { HttpModule } from "@angular/http";
import { WindowMock } from "../../services/cache.service.spec";
import { TableDataService } from "../../services/tabledata.service";
import { CacheService } from "../../services/cache.service";

describe("components/root", () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RootComponent,
        DatatableComponent
      ],
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
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});