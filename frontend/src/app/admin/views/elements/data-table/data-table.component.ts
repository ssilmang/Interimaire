import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { IColumn, IProduct, TableData } from './table.data';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { DataPermanent, Permanent, RequestSupprimer } from 'src/app/_core/interface/permanent';
import { environment } from 'src/environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass, DataTableComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class AdminDataTableComponent  implements OnInit{
  chefServiceVisible = false;
  collaborateurServiceVisible = false;
  public dataDV?:DataPermanent;
  public message:string="";
  dataDetails?:Permanent;
  apiImg=environment.apiImg;
  pole:boolean=true;
  collaborateur?:Permanent;
  support:string ="support";
  showModal:boolean = false;
  isDropdownOpen:boolean = true;
  modalCompnent: ModalComponent;
  id:string |null= null;
  public products: IProduct[] = TableData.products;
  public pages: number[] = TableData.pageNumber;
  public columnData:IColumn[] = TableData.columnData;
  taille:number=4;
  page:number = 1;
  dataPermanent?:DataPermanent
  route=inject(ActivatedRoute)
  constructor(private service:PermanentService,private crefDestroy:DestroyRef,private crefDetecte:ChangeDetectorRef){
    this.modalCompnent = new ModalComponent();
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.indexPermanent(this.id)
  }
  ngOnChanges(){
    this.dataDV =this.dataPermanent
  }
  indexPermanent(id:string|null)
  {
    this.service.indexPermanents(id,this.taille,this.page).subscribe({
      next:(response=>{
        this.dataDV = response.data;
      })
    })
  }

  suppEvent(data:any)
  {
    this.service.supprimerPersonne(data.form,data.id).pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response)=>{
        console.log(response);
        this.message= response.message
        setTimeout(()=>{
          this.message =""
        },5000);        
        const index = this.dataDV?.collaborateurs.findIndex(ele => ele.profile.id === response.data.profile.id);
        console.log(index);
        if (index !== -1 && index!=undefined) 
        {            
         this.dataDV?.collaborateurs.splice(index,1)    
         this.dataPermanent = this.dataDV;
        }
      } 
    })
  }
}
