import { Inject, Injectable } from "@angular/core";

@Injectable()
export class CacheService {

  StateManager: IStateManager;

  constructor(@Inject("$window") private _window: Window) {
    this.StateManager = new StateManager(this._window);
  }

}

export interface IStateManager {
  GlobalScope: Window;
  CachedProperties: ICachedProperties;
  CurrentState: any;
  GetValue(controlID: string, property: string, defaultValue: any): any;
  SetValue(controlID: string, property: string, value: any): void;
}

export interface ICachedProperties {
  FirstDisplayedPageNumber: string;
  CurrentPage: string;
  FilterText: string;
  FilterColumn: string;
  SortColumn: string;
  SortOrder: string;
}

class StateManager implements IStateManager {
  GlobalScope: Window;
  CachedProperties: ICachedProperties;
  CurrentState: any;
  GetValue(controlID: string, property: string, defaultValue: any): any {
    if (!this.CurrentState[controlID]) this.CurrentState[controlID] = {};
    return typeof this.CurrentState[controlID][property] === "undefined" ? defaultValue : this.CurrentState[controlID][property];
  };
  SetValue(controlID: string, property: string, value: any): void {
    if (!this.CurrentState[controlID]) this.CurrentState[controlID] = {};
    this.CurrentState[controlID][property] = value;
    if (this.GlobalScope.localStorage) this.GlobalScope.localStorage.TreeviewCache = JSON.stringify(this.CurrentState);
  };
  constructor(globalScope: Window) {
    this.GlobalScope = globalScope;
    this.CurrentState = globalScope.localStorage && globalScope.localStorage.TreeviewCache ? JSON.parse(globalScope.localStorage.TreeviewCache) : {};
    this.CachedProperties = {
      FirstDisplayedPageNumber: "FirstDisplayedPageNumber",
      CurrentPage: "CurrentPage",
      FilterText: "FilterText",
      FilterColumn: "FilterColumn",
      SortColumn: "SortColumn",
      SortOrder: "SortOrder"
    }
  }
}