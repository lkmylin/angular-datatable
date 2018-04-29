import { DataTable } from "./datatable";

export class DataTablePager {

  Parent: DataTable;
  PageNumberDisplayCount: number;
  RowsPerPage: number;
  CurrentPage: number;
  FirstDisplayedPageNumber: number;
  TotalRowCount: number;
  TotalPageCount: number;
  DisplayedPageNumbers: Array<number>;
  DisplayRowsStartIndex: number;
  DisplayRowsEndIndex: number;
  SetDisplay(bUpdateCache: boolean) : void {
    const context = this;
    context.DisplayedPageNumbers = [];
    for (let i = context.FirstDisplayedPageNumber; i < context.FirstDisplayedPageNumber + context.PageNumberDisplayCount; i++) {
      context.DisplayedPageNumbers[context.DisplayedPageNumbers.length] = i;
      if (i === context.TotalPageCount) break;
    }
    context.DisplayRowsStartIndex = context.RowsPerPage * (context.CurrentPage - 1);
    context.DisplayRowsEndIndex = context.RowsPerPage * context.CurrentPage - 1;
    if (context.DisplayRowsEndIndex > context.TotalRowCount - 1) {
      context.DisplayRowsEndIndex = context.TotalRowCount - 1;
    }
    if (bUpdateCache) {
      context.Parent.StateManager.SetValue(context.Parent.ID, context.Parent.CacheProperties.CurrentPage, context.CurrentPage);
      context.Parent.StateManager.SetValue(context.Parent.ID, context.Parent.CacheProperties.FirstDisplayedPageNumber, context.FirstDisplayedPageNumber);
    }
  };
  Go(page: number) : void {
    const context = this;
    if (page < 1 || page > context.TotalPageCount) return;
    context.CurrentPage = page;
    let firstDisplayedPageNumber = context.DisplayedPageNumbers[0];
    const lastDisplayedPageNumber = context.DisplayedPageNumbers[context.DisplayedPageNumbers.length -1];
    if (context.CurrentPage < firstDisplayedPageNumber) firstDisplayedPageNumber = context.CurrentPage;
    if (context.CurrentPage > lastDisplayedPageNumber) firstDisplayedPageNumber = context.CurrentPage - context.PageNumberDisplayCount + 1;
    context.FirstDisplayedPageNumber = firstDisplayedPageNumber;
    context.SetDisplay(true);
    context.Parent.SetDisplay();
  };
  Advance(bForward: boolean) : void {
    const context = this;
    if (context.TotalPageCount <= context.PageNumberDisplayCount) return;
    if (context.CurrentPage === 1 && !bForward) return;
    if (context.CurrentPage === context.TotalPageCount && bForward) return;
    const firstDisplayedPageNumber = context.DisplayedPageNumbers[0];
    const lastDisplayedPageNumber = context.DisplayedPageNumbers[context.DisplayedPageNumbers.length -1];
    if (firstDisplayedPageNumber === 1 && !bForward) return;
    if (lastDisplayedPageNumber === context.TotalPageCount && bForward) return;
    const lastPossibleFirstDisplayedPageNumber = context.TotalPageCount - context.PageNumberDisplayCount + 1;
    if (bForward) {
      const target = firstDisplayedPageNumber + context.PageNumberDisplayCount;
      context.FirstDisplayedPageNumber = target <= lastPossibleFirstDisplayedPageNumber ? target : lastPossibleFirstDisplayedPageNumber;
      context.CurrentPage = context.FirstDisplayedPageNumber;
    }
    else {
      const target = firstDisplayedPageNumber - context.PageNumberDisplayCount;
      context.FirstDisplayedPageNumber = target > 1 ? target : 1;
      context.CurrentPage = context.FirstDisplayedPageNumber + context.PageNumberDisplayCount - 1;
    }
    context.SetDisplay(true);
    context.Parent.SetDisplay();
  };

  constructor (parent: DataTable, currentPage: number, rowCount: number, firstDisplayedPageNumber: number, rowsPerPage: number = 10, pageNumberDisplayCount: number = 10) {
    const context = this;
    context.Parent = parent;
    context.PageNumberDisplayCount = pageNumberDisplayCount;
    context.RowsPerPage = rowsPerPage;
    context.CurrentPage = currentPage;    
    context.FirstDisplayedPageNumber = firstDisplayedPageNumber;
    context.TotalRowCount = rowCount;
    if (context.TotalRowCount > context.RowsPerPage) {
      context.TotalPageCount = Math.floor(context.TotalRowCount / context.RowsPerPage);
      if (context.TotalRowCount % context.RowsPerPage !== 0) {
        context.TotalPageCount += 1;
      }
    }
    else {
      context.TotalPageCount = 1;
    }
    if (context.CurrentPage > context.TotalPageCount) {
      context.CurrentPage = context.TotalPageCount;
      context.FirstDisplayedPageNumber = context.TotalPageCount - context.PageNumberDisplayCount + 1;
      if (context.FirstDisplayedPageNumber < 1) context.FirstDisplayedPageNumber = 1;
    }
    context.SetDisplay(false);
  };

}