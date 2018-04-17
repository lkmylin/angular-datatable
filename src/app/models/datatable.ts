import { DataTablePager } from "./pager";
import { CacheService, IStateManager } from "../services/cache.service";

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
  Update: () => void = () : void => {
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
  Filter: (filterColumn: string, filterText: string, bUpdateCache: boolean) => void = (filterColumn: string, filterText: string, bUpdateCache) : void => {
    const context = this;    
    context.FilteredRows = context.Rows;
    context.FilterText = filterText.toLowerCase();
    context.FilterColumn = filterColumn;
    context.FilteredRows = context.FilteredRows.filter(row => row[context.FilterColumn].toLowerCase().search(context.FilterText) > -1);
    context.Pager = new DataTablePager(context, context.Pager.CurrentPage, context.FilteredRows.length, context.Pager.FirstDisplayedPageNumber, context.Pager.RowsPerPage, context.Pager.PageNumberDisplayCount);
    if (bUpdateCache) {
      context.StateManager.SetValue(context.ID, context.StateManager.CachedProperties.FilterColumn, context.FilterColumn);
      context.StateManager.SetValue(context.ID, context.StateManager.CachedProperties.FilterText, context.FilterText);
    }
    context.Update();
  };
  Sort: (column: DataTableColumn, bSwitch: boolean) => void = (column: DataTableColumn, bSwitch: boolean) : void => {
    const context = this;
    column.SortOrder = bSwitch ? -1 * column.SortOrder : column.SortOrder;
    context.SortColumn = column;
    context.Rows = context.Rows.sort((x, y) => x[context.SortColumn.ColumnID].toLowerCase() > y[context.SortColumn.ColumnID].toLowerCase() ? context.SortColumn.SortOrder : -1 * context.SortColumn.SortOrder);
    if (bSwitch) {
      context.StateManager.SetValue(context.ID, context.StateManager.CachedProperties.SortColumn, context.SortColumn.ColumnID);
      context.StateManager.SetValue(context.ID, context.SortColumn.ColumnID + context.StateManager.CachedProperties.SortOrder, context.SortColumn.SortOrder);
    }
    context.Filter(context.FilterColumn, context.FilterText, false);
  };

  constructor(id: string, data: Array<any>, cacheService: CacheService, rowsPerPage: number = 10, pageNumberDisplayCount: number = 10) {
    const context = this;
    context.ID = id;
    context.StateManager = cacheService.StateManager;
    context.Rows = data;
    context.Columns = [];
    for (const property in data[0]) {
      context.Columns[context.Columns.length] = {
        ColumnID: property,
        SortOrder: cacheService.StateManager.GetValue(context.ID, property + context.StateManager.CachedProperties.SortOrder, 1)
      };
    }    
    const sortColumnID = context.StateManager.GetValue(context.ID, context.StateManager.CachedProperties.SortColumn, context.Columns[0].ColumnID);
    context.SortColumn = context.Columns.filter(c => c.ColumnID === sortColumnID)[0];
    context.FilterColumn = context.StateManager.GetValue(context.ID, context.StateManager.CachedProperties.FilterColumn, context.Columns[0].ColumnID);
    context.FilterText = context.StateManager.GetValue(context.ID, context.StateManager.CachedProperties.FilterText, "");
    const currentPage = context.StateManager.GetValue(context.ID, context.StateManager.CachedProperties.CurrentPage, 1);
    const firstDisplayedPageNumber = context.StateManager.GetValue(context.ID, context.StateManager.CachedProperties.FirstDisplayedPageNumber, 1);
    context.Pager = new DataTablePager(context, currentPage, context.Rows.length, firstDisplayedPageNumber, rowsPerPage, pageNumberDisplayCount);
    context.Sort(context.SortColumn, false);
  }
    
}

export class DataTableColumn {
  ColumnID: string;
  SortOrder: number;
}