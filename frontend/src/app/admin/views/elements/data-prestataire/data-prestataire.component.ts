import { Component, OnInit } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { IColumn, TableData } from '../data-table/table.data';
import { CommonModule, NgClass } from '@angular/common';
import { DataPrestataireComponent } from 'src/app/shared/components/data-prestataire/data-prestataire.component';
import { PrestataireService } from 'src/app/_core/services/prestataire.service';

@Component({
  selector: 'app-data-prestataire',
  standalone: true,
  imports: [NgClass,DataPrestataireComponent],
  templateUrl: './data-prestataire.component.html',
  styleUrl: './data-prestataire.component.css'
})
export class AdminDataPrestataireComponent implements OnInit {
  public dataPrestataire:Permanent[]=[]
  public pages: number[] = TableData.pageNumber;
  public columnData:IColumn[] = TableData.columnData;

  constructor(private service:PrestataireService){

  }
  ngOnInit(): void {
    this.isPrestataire()
  }
  isPrestataire()
  {
    this.service.isPrestataire().subscribe({
      next:(response=>{
        console.log(response);
        this.dataPrestataire = response.data

        
      })
    })
  }
}
