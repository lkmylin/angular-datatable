import { TestBed, inject } from "@angular/core/testing";
import { CacheService } from "./cache.service";
import { HttpModule } from "@angular/http";

describe("services/cache", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: "$window", useValue: new WindowMock({})},
        CacheService
      ],
      imports: [HttpModule]
    });
  });

  it("should be created", inject([CacheService], (service: CacheService) => {
    expect(service).toBeTruthy();
  }));
});

export class WindowMock {
  localStorage: any;
  constructor (localStorage: any) {
    this.localStorage = localStorage;
  }
}