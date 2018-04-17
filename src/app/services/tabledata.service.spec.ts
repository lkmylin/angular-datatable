import { TestBed, inject } from "@angular/core/testing";
import { TableDataService } from "./tabledata.service";
import { CacheService } from "./cache.service";
import { HttpModule } from "@angular/http";
import { WindowMock } from "./cache.service.spec";

describe("services/tabledata", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: "$window", useValue: new WindowMock({})},
        TableDataService,
        CacheService
      ],
      imports: [HttpModule]
    });
  });

  it("should be created", inject([TableDataService], (service: TableDataService) => {
    expect(service).toBeTruthy();
  }));
});