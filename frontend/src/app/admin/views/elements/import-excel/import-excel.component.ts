import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-import-excel',
  standalone: true,
  imports: [],
  templateUrl: './import-excel.component.html',
  styleUrl: './import-excel.component.css'
})
export class ImportExcelComponent implements OnInit, AfterViewInit
{
  dataExcel:any;
  excelTrue:boolean=true
  importFile!:File;
  constructor(private shared:LocalStorageService,private service:PermanentService)
  {

  }
  ngAfterViewInit(): void 
  {
    let data= JSON.parse(this.shared.get('dataExcel'))  
    this.dataExcel = data
    if(data.length!=0 && data.length !=undefined)
    {
      this.excelTrue=false;
    }
  }
  ngOnInit(): void
  {
    
  }
  selectFileExcel(event:any)
  {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      this.importFile = file as File
      fileReader.onload = (e: any) =>
      {
        const arrayBuffer = e.target.result;
           this.parseExcel(arrayBuffer);
      };
      this.shared.remove('dataExcel')
      fileReader.readAsArrayBuffer(file);
      // this.formExcel.patchValue({'files':file})
      // this.isvalid = false
  }
  parseExcel(arrayBuffer: any): void 
  {
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    this.dataExcel = jsonData
    if(this.dataExcel.length!=0 && this.dataExcel.length !=undefined)
    {
      this.excelTrue=false;
    }
    this.shared.put('dataExcel',JSON.stringify(jsonData));
  }
  enregistrer=()=>{
    if(this.importFile)
    {
      const formData = new FormData();
      console.log(this.importFile);
      
      formData.append('files',this.importFile);
      this.service.importer(formData).subscribe({
        next:(response)=>{
          console.log(response);
        }
      })
    }
  }

}
