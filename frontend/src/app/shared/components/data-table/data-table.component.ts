import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { ModalModule } from '../modal/modal.module';
import { FormsModule } from '@angular/forms';
import { InterimService } from 'src/app/_core/services/interim.service';
import { CommonService } from 'src/app/_core/services/common.service';
import { AppRoutes } from 'src/app/app.routes';
import { AdminRoutes, ElementRoutes, SettingRoutes } from 'src/app/admin/admin.routes';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { LocalStorageService } from '../../services/localStorage.service';
@Component({
  selector: 'data-table',
  standalone: true,
  imports: [NgClass, NgIf,ModalModule,FormsModule,RouterLink],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent implements OnInit{
  @Input() columnData: any = [];
  @Input() rowData?: Permanent;
  @Input() pageData: number[] = [];
  apiImg=environment.apiImg;
  showModal:boolean = false;
  isDropdownOpen:boolean = true;
  shorting: boolean = false;
  dataDetails?:Permanent;
  collaborateur?:Permanent;
  modalCompnent: ModalComponent;
  faireCommentaire:boolean = true;
  isCommentaire:boolean = false
  couleur:string = "bg-red-600  hover:bg-red-700"
  commentaire:string = "";
  annuler: boolean = true;
  readonly appRoutes = AppRoutes;
  readonly adminRoutes = AdminRoutes;
  readonly settingRoutes = SettingRoutes;
  readonly elementRoutes = ElementRoutes;
  id:string|null = null
  route = inject(ActivatedRoute)
  hiddern: string='hidden';
  constructor(
    private service:InterimService ,
    private serve:PermanentService, 
     public readonly commonService:CommonService,
     private shared:LocalStorageService,
     private router:Router,
    ){
    this.modalCompnent = new ModalComponent();
  }
  ngOnInit(): void 
  {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.indexPermanent(this.id);
    });
  }
  indexPermanent(id:string|null)
  {
    this.serve.indexPermanents(id).subscribe({
      next:(response=>{
        this.rowData = response.data
        this.collaborateur  =response.data
      })
    })
  }
  sortingUp() {
    this.shorting = !this.shorting;
  }
  sortingDown()
  {
    this.shorting = !this.shorting;
  }
  afficherDetails(collab?: Permanent)
  {
    this.dataDetails= collab;
    this.showModal = !this.showModal;
    this.faireCommentaire = true
  }
  onModalCloseHandler(event: boolean)
  {
    this.showModal = event;
    this.faireCommentaire = true
    this.annuler = true
    this.isCommentaire = false;
    this.couleur =  "bg-red-600  hover:bg-red-700"
  }
  toggleDropdown()
  {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleAccordion(permanent:Permanent,index: number) 
  { 
    permanent.status = !permanent.status;
  }
  afficheChefService(collab?:Permanent)
  {
    this.collaborateur = collab;
    this.rowData = collab;
  }
  clickCommentaire(event:string)
  {
    this.faireCommentaire = false;
    let string = "Enregistrer";   
    this.isCommentaire = true; 
    this.annuler = false;
    this.couleur= "bg-green-700  hover:bg-green-800"
    if(event.toLowerCase() === string.toLowerCase())
    {
        let idUser = this.dataDetails?.profile.id;
        const data = {
          commentaire:this.commentaire
          };
        this.service.isCommentaire(data,idUser!).subscribe({
          next:(response=>{
            if(response.statut==200)
            {
              if (this.dataDetails) {
                this.dataDetails.profile = response.data;
              }
              this.annuler = true;
              this.showModal =false
              this.faireCommentaire = true
              this.isCommentaire = false;
               this.couleur= "bg-red-600  hover:bg-red-700"
            }
          })
        })
    }else{
      this.commentaire = this.dataDetails?.profile.commentaire!
    }
  }
  editer(permanent?:Permanent)
  {
    this.shared.changeInterim(permanent);
    this.router.navigateByUrl('/admin/elements/forms');
  }
  export()
  {
    this.hiddern = 'block';
    console.log("fvffd");    
  }
  valider()
  {
    this.shared.chargerExport('permanents','null','null');
    this.hiddern = 'hidden';
  }
  close()
  {
    this.hiddern = 'hidden';
  }
}
