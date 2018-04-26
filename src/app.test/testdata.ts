export class TestData {
  ID: string = "table1";
  RowsPerPage: number = 10;
  PageNumberDisplayCount: number = 10;
  Rows: Array<any>;
  SortFriendlyRows: Array<any> = [
    {Column1: "g", Column2: "gg", Column3: "ggg"},
    {Column1: "d", Column2: "dd", Column3: "ddd"},
    {Column1: "h", Column2: "hh", Column3: "hhh"},
    {Column1: "a", Column2: "aa", Column3: "aaa"},
    {Column1: "f", Column2: "ff", Column3: "fff"},
    {Column1: "c", Column2: "cc", Column3: "ccc"},
    {Column1: "j", Column2: "jj", Column3: "jjj"},
    {Column1: "b", Column2: "bb", Column3: "bbb"},
    {Column1: "i", Column2: "ii", Column3: "iii"},
    {Column1: "e", Column2: "ee", Column3: "eee"}
  ]
  constructor (count: number) {
    this.Rows = [];
    for (let i = 0; i < count; i++) {
      this.Rows.push({"Column 1": "Column 1 Value " + i,"Column 2": "Column 2 Value " + i,"Column3": "Column 3 Value " + i});
    }
  }
}