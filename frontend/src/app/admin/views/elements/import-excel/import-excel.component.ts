import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-import-excel',
  standalone: true,
  imports: [],
  templateUrl: './import-excel.component.html',
  styleUrl: './import-excel.component.css'
})
export class ImportExcelComponent implements OnInit, AfterViewInit{
  constructor()
  {

  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    
  }
  selectFileExcel(event:any)
  {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      console.log(file.name);
      // this.importFile = file as File
      fileReader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
          this.parseExcel(arrayBuffer);
      };
      fileReader.readAsArrayBuffer(file);
      console.log(file);
      
      // this.formExcel.patchValue({'files':file})
      // this.isvalid = false
      
  }
  parseExcel(arrayBuffer: any): void {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(arrayBuffer).then((workbook) => {
      let jsonData: any[] = [];
      let jsonColor:any[] =[];
      workbook.eachSheet((worksheet, sheetId) => {
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          let rowData: any = {};
          let rowColor:any = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[`column${colNumber}`] = cell.value;
           
          });
          jsonData.push(rowData);
          jsonColor.push(rowColor)
        });
      });
      // this.importData = jsonData
      // this.importColor = jsonColor
      console.log(jsonData);
      
    });
  }

}
