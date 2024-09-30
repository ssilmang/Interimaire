import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { DataALL, Permanent } from 'src/app/_core/interface/permanent';
import { IColumn, TableData } from '../data-table/table.data';
import { CommonModule, NgClass } from '@angular/common';
import { DataPrestataireComponent } from 'src/app/shared/components/data-prestataire/data-prestataire.component';
import { PrestataireService } from 'src/app/_core/services/prestataire.service';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  public dataAll?:DataALL
  currentPage: number = 0;
  taille:number = 4;
  total!:number;
  public message:string="";
  prestataireData!: Permanent[];
  constructor(
    private service:PrestataireService,
    private crefDestroy:DestroyRef,
    private shared:LocalStorageService,
    private cref:ChangeDetectorRef
  ){

  }
  ngOnInit(): void
  {
    this.isPrestataire(this.taille,this.currentPage);
    this.index();
  }
  ngAfterViewInit(): void
  {
    this.shared.currentPaginate.pipe(takeUntilDestroyed(this.crefDestroy)).subscribe(element=>{
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
    this.service.isPrestataire(taille,currentPage).pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
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
  suppEvent(data:any)
  {
    this.service.supprimerPersonne(data.form,data.id).pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response)=>{
        this.message= response.message
        setTimeout(()=>{
          this.message =""
        },5000);        
        const index = this.dataPrestataire.findIndex(ele => ele.profile.id === response.data.profile.id);
        console.log(index);
        if (index !== -1 && index!=undefined) 
        {            
         this.dataPrestataire.splice(index,1)    
         this.prestataireData = this.dataPrestataire;
        }
      } 
    })
  }
  index(){
    this.service.indexAll().subscribe({
      next:(data=>{
        this.dataAll = data.data;
      })
    })
  }
}
