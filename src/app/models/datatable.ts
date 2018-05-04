import { DataTablePager } from "./pager";
import { IStateManager, StateManager } from "@lkmylin/angular-statemanager";

export class DataTable {

  ID: string;
  Rows: Array<any>;
  FilteredRows: Array<any>;
  Columns: Array<DataTableColumn>;
  StateManager: IStateManager;    
  Pager: DataTablePager;
  DisplayedRows: Array<any>;
  FilterColumn: string;
  FilterText: string;
  SortColumn: DataTableColumn;
  CacheProperties: DataTableCacheProperties;
  SetDisplay() : void {
    const context = this;
    if (context.Pager.TotalPageCount === 1) {
      context.DisplayedRows = context.FilteredRows;
    }
    else {
        context.DisplayedRows = [];
        for (let i = context.Pager.DisplayRowsStartIndex; i <= context.Pager.DisplayRowsEndIndex; i++) {
            context.DisplayedRows[context.DisplayedRows.length] = context.FilteredRows[i];
        }
    }
  };
  Update(filterColumn: string, filterText: string, sortColumn: DataTableColumn) : void {
    const context = this;
    if (filterColumn) {
      context.FilteredRows = context.Rows;
      context.FilterText = filterText.toLowerCase();
      context.FilterColumn = filterColumn;
      context.StateManager.SetValue(context.ID, context.CacheProperties.FilterColumn, context.FilterColumn);
      context.StateManager.SetValue(context.ID, context.CacheProperties.FilterText, context.FilterText);
      context.Filter();
      context.MakePager(context.Pager.CurrentPage, context.FilteredRows.length, context.Pager.FirstDisplayedPageNumber, context.Pager.RowsPerPage, context.Pager.PageNumberDisplayCount);
    }
    if (sortColumn) {
      sortColumn.SortOrder = -1 * sortColumn.SortOrder;
      context.SortColumn = sortColumn;
      context.StateManager.SetValue(context.ID, context.CacheProperties.SortColumn, context.SortColumn.ColumnID);
      context.StateManager.SetValue(context.ID, context.SortColumn.ColumnID + context.CacheProperties.SortOrder, context.SortColumn.SortOrder);
    }
    context.Sort();
    context.SetDisplay();
  };
  private Filter() : void {
    const context = this;
    if (context.FilterText === "") {
      context.FilteredRows = context.Rows;
    }
    else {
      context.FilteredRows = context.Rows.filter(row => row[context.FilterColumn].toLowerCase().search(context.FilterText) > -1);
    }
  };
  private Sort() : void {
    const context = this;
    context.FilteredRows = context.FilteredRows.sort((x, y) => x[context.SortColumn.ColumnID].toLowerCase() > y[context.SortColumn.ColumnID].toLowerCase() ? context.SortColumn.SortOrder : -1 * context.SortColumn.SortOrder);
  };
  private MakePager(currentPage: number, totalRowCount: number, firstDisplayedPageNumber: number, rowsPerPage: number, pageNumberDisplayCount: number) : void {
    this.Pager = new DataTablePager(this, currentPage, totalRowCount, firstDisplayedPageNumber, pageNumberDisplayCount);
  };

  constructor(id: string, data: Array<any>, stateManager: IStateManager, rowsPerPage: number = 10, pageNumberDisplayCount: number = 10) {
    const context = this;
    context.ID = id;
    context.CacheProperties = new DataTableCacheProperties();
    context.StateManager = stateManager;
    context.Rows = data || [];
    context.Columns = [];
    if (context.Rows.length === 0) return;
    for (const property in context.Rows[0]) {
      context.Columns[context.Columns.length] = {
        ColumnID: property,
        SortOrder: stateManager.GetValue(context.ID, property + context.CacheProperties.SortOrder, 1)
      };
    }
    const currentPage = context.StateManager.GetValue(context.ID, context.CacheProperties.CurrentPage, 1);
    const firstDisplayedPageNumber = context.StateManager.GetValue(context.ID, context.CacheProperties.FirstDisplayedPageNumber, 1);
    const sortColumnID = context.StateManager.GetValue(context.ID, context.CacheProperties.SortColumn, context.Columns[0].ColumnID);
    context.SortColumn = context.Columns.filter(c => c.ColumnID === sortColumnID)[0] || context.Columns[0];
    context.FilterColumn = context.StateManager.GetValue(context.ID, context.CacheProperties.FilterColumn, context.Columns[0].ColumnID);
    context.FilterText = context.StateManager.GetValue(context.ID, context.CacheProperties.FilterText, "");    
    context.Filter();
    context.Sort();
    context.MakePager(currentPage, context.FilteredRows.length, firstDisplayedPageNumber, rowsPerPage, pageNumberDisplayCount);
    context.SetDisplay();
  }
    
}

export class DataTableColumn {
  ColumnID: string;
  SortOrder: number;
}

export class DataTableCacheProperties {
  CurrentPage: string = "CurrentPage";
  FirstDisplayedPageNumber: string = "FirstDisplayedPageNumber";
  FilterText: string = "FilterText";
  FilterColumn: string = "FilterColumn";
  SortColumn: string = "SortColumn";
  SortOrder: string = "SortOrder";
}