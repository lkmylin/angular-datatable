export class TestData {
  ID: string = "table1";
  RowsPerPage: number = 10;
  PageNumberDisplayCount: number = 10;
  Rows: Array<any>;
  constructor (count: number) {
    this.Rows = [];
    for (let i = 0; i < count; i++) {
      this.Rows.push({"Column 1": "Column 1 Value " + i,"Column 2": "Column 2 Value " + i,"Column3": "Column 3 Vaue " + i});
    }
  }
}