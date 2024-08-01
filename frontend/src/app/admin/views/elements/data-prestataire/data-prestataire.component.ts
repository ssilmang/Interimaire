import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { IColumn, TableData } from '../data-table/table.data';
import { CommonModule, NgClass } from '@angular/common';
import { DataPrestataireComponent } from 'src/app/shared/components/data-prestataire/data-prestataire.component';
import { PrestataireService } from 'src/app/_core/services/prestataire.service';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';

@Component({
  selector: 'app-data-prestataire',
  standalone: true,
  imports: [NgClass,DataPrestataireComponent],
  templateUrl: './data-prestataire.component.html',
  styleUrl: './data-prestataire.component.css'
})
export class AdminDataPrestataireComponent implements OnInit, AfterViewInit {
  public dataPrestataire:Permanent[]=[]
  public pages: number[] = TableData.pageNumber;
  public columnData:IColumn[] = TableData.columnData;
  currentPage: number = 0;
  taille:number = 4;
  total!:number
  constructor(private service:PrestataireService,private shared:LocalStorageService,private cref:ChangeDetectorRef){

  }
  ngOnInit(): void {
    this.isPrestataire(this.taille,this.currentPage)
  }
  ngAfterViewInit(): void {
    this.shared.currentPaginate.subscribe(element=>{
     if(element){
      this.currentPage = element.currentPage;
      this.taille = element.taille;
      this.isPrestataire(element.taille,element.currentPage);
      this.cref.detectChanges()
    }
    })
  }
  isPrestataire(taille:number,currentPage:number)
  {  
    this.service.isPrestataire(taille,currentPage).subscribe({
      next:(response=>{
        this.dataPrestataire = response.data.prestataires;
        this.taille = response.data.pagination.taille;
        this.total = response.data.pagination.total;
        this.currentPage = response.data.pagination.page
      })
    })
  }
  get totalPages(): number[] 
  {
    const pagesCount = Math.ceil(this.total / this.taille);
    return Array.from({ length: pagesCount }, (_, index) => index + 1);
  }
}
