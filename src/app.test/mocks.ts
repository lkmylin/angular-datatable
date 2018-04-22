import { IStateManager } from "@lkmylin/angular-statemanager";

export class StateManagerMock implements IStateManager {
  GlobalScope: Window;
  CurrentState: any;
  GetValue: (id: string, property: string, defaultValue: string) => void = (id: string, property: string, defaultValue: string) => {
    return defaultValue;
  };
  SetValue: (id: string, property: string, value: any) => void = (id: string, property: string, value: any) => { };
}