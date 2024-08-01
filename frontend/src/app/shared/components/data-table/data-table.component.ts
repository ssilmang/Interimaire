import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { DataPermanent, Permanent } from 'src/app/_core/interface/permanent';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { ModalModule } from '../modal/modal.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterimService } from 'src/app/_core/services/interim.service';
import { CommonService } from 'src/app/_core/services/common.service';
import { AppRoutes } from 'src/app/app.routes';
import { AdminRoutes, ElementRoutes, SettingRoutes } from 'src/app/admin/admin.routes';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { RechercherLibellePipe } from 'src/app/admin/pipe/rechercher-libelle.pipe';
import * as  XLSX from 'xlsx';
@Component({
  selector: 'data-table',
  standalone: true,
  imports: [
    CommonModule,
     ModalModule,
     FormsModule,
     RouterLink,
     MatAutocompleteModule,
     MatInputModule,
     ReactiveFormsModule,
     RechercherLibellePipe,
    ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent implements OnInit{
  @Input() columnData: any = [];
  @Input() rowData?: DataPermanent;
  @Input() pageData: number[] = [];
  libelle:string=''
  apiImg=environment.apiImg;
  showModal:boolean = false;
  isDropdownOpen:boolean = true;
  shorting: boolean = false;
  dataDetails?:Permanent;
  collaborateur?:Permanent[];
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
  taille:number = 4;
  currentPage:number = 1;
  total!:number;
  myControl=new FormControl('4');
  options: string[] = ['4','9','15','20','30','40','50','60','70','80','90','100'];
  filteredOptions!: Observable<string[]>;
  optionselect:string = '';
  messageHidden:string='';
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
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options;
  }
  indexPermanent(id:string|null)
  {
    this.serve.indexPermanents(id,this.taille,this.currentPage).subscribe({
      next:(response=>{
        this.rowData = response.data
        this.collaborateur  =response.data.collaborateurs;
        this.taille = response.data.pagination.taille;
        this.currentPage = response.data.pagination.page;
        this.total = response.data.pagination.total;

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
  // afficheChefService(collab?:Permanent)
  // {
  //   this.collaborateur = collab;
  //   this.rowData = collab;
  // }
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
    console.log(this.optionselect);
    
    if(this.optionselect==='tous'){
      this.messageHidden = "Vous voulez  exporter  tous les permanents"
    }else if(this.optionselect ==='global'){
      this.messageHidden = "Vous voulez  exporter  le ficher global"
    }else{
      this.messageHidden = "export les permanents";
    }
  }
  valider()
  {
    this.hiddern = 'hidden';
    if(this.optionselect==='tous'){
      this.shared.chargerExport('permanents','null','null');
    }else if(this.optionselect==='global'){
      this.shared.chargerExport('permanents','prestataires','interimaires');
    }else{
      this.exportContrat('permanent_data')
    }
  }
  close()
  {
    this.hiddern = 'hidden';
  }
  get totalPages(): number[] 
  {
    const pagesCount = Math.ceil(this.total / this.taille);
    return Array.from({ length: pagesCount }, (_, index) => index + 1);
  }
  PageTailleChange=(event: Event): void =>
    { 
      let nmbre =  Number((event.target as HTMLInputElement).value);   
       this.option(nmbre);
    }
  optionSelected(event: any): void 
  {
    const selectedValue = event.option.value;
    this.myControl.setValue(selectedValue);
    this.option(this.myControl.value)
  }
  option(nmbre:any):void
  {
    if(!isNaN(nmbre)){
      if(nmbre <= this.total){
        this.taille =nmbre;
      }else{
        this.taille= this.total
        this.currentPage =0
      }
    }else{
      this.taille = this.total;
      this.currentPage=0
    }
    this.indexPermanent(this.id)
  }
  prevPage=(): void=>
  {
    if (this.currentPage > 1)
    {
      this.currentPage--;
      this.indexPermanent(this.id);
    }
  }
  nextPage=(): void=>
  {
    if (this.currentPage < this.totalPages.length)
    {
      this.currentPage++;
      this.indexPermanent(this.id);
    }
  }
  selectPage=(page:number):void=>
  {
    this.currentPage=page;
    this.indexPermanent(this.id)
  }
  selectOption(event:Event){
    let option = (event.target as HTMLSelectElement).value;
    this.optionselect = option;
  }
  exportContrat(nomFichier:string)
  {   
    const data  = this.rowData?.collaborateurs?.map(permanent=>({ 
          "Matricule":permanent?.profile?.matricule?? 'N/A',
          'Prénom':permanent?.profile?.prenom ?? 'N/A',
          'Nom':permanent?.profile?.nom ?? 'N/A',
          'Poste':permanent?.poste?.libelle ?? 'N/A',
          'Canal':permanent?.canal?.libelle ?? 'N/A',
          'Direction':permanent?.direction?.libelle??'N/A',
          'Pole':permanent?.pole?.libelle ?? 'N/A',
          'Departement':permanent?.departement?.libelle ?? 'N/A',
          'Service':permanent?.service?.libelle ?? 'N/A',
          'Lieu d\'exécution':permanent?.locau.libelle??'N/A',
          'Responsable Hiérarchique':permanent?.responsable?.profile?.prenom+' '+permanent?.responsable?.profile?.nom ?? 'N/A',
          'Statut':permanent?.statut?.libelle ?? 'N/A',
          'Agence interim':permanent?.agence?.libelle ?? 'N/A',
          'Groupe':permanent?.groupe?.libelle??'N/A',
          'Categorie':permanent?.categorie?.libelle ?? 'N/A',
          'MOVEMENT : Avancement/Promotion':'N/A',
          'DATE DERNIER(E) : Avancement/Promotion':'N/A',
          'Téléphone':permanent?.profile?.telephone ?? 'N/A',
          'Téléphone pro':permanent?.profile?.telephone_pro ?? 'N/A',
          'Courriel':permanent?.profile?.email ?? 'N/A',
          'Commentaire':permanent?.profile?.commentaire ?? 'N/A',
    }));
    data?.unshift( {
      "Matricule":this.rowData?.permanent?.profile?.matricule?? 'N/A',
      'Prénom':this.rowData?.permanent?.profile?.prenom ?? 'N/A',
      'Nom':this.rowData?.permanent?.profile?.nom ?? 'N/A',
      'Poste':this.rowData?.permanent?.poste?.libelle ?? 'N/A',
      'Canal':this.rowData?.permanent?.canal?.libelle ?? 'N/A',
      'Direction':this.rowData?.permanent?.direction?.libelle??'N/A',
      'Pole':this.rowData?.permanent?.pole?.libelle ?? 'N/A',
      'Departement':this.rowData?.permanent?.departement?.libelle ?? 'N/A',
      'Service':this.rowData?.permanent?.service?.libelle ?? 'N/A',
      'Lieu d\'exécution':this.rowData?.permanent?.locau.libelle??'N/A',
      'Responsable Hiérarchique':this.rowData?.permanent?.responsable?.profile?.prenom+' '+this.rowData?.permanent?.responsable?.profile?.nom ?? 'N/A',
      'Statut':this.rowData?.permanent?.statut?.libelle ?? 'N/A',
      'Agence interim':this.rowData?.permanent?.agence?.libelle ?? 'N/A',
      'Groupe':this.rowData?.permanent?.groupe?.libelle??'N/A',
      'Categorie':this.rowData?.permanent?.categorie?.libelle ?? 'N/A',
      'MOVEMENT : Avancement/Promotion':'N/A',
      'DATE DERNIER(E) : Avancement/Promotion':'N/A',
      'Téléphone':this.rowData?.permanent?.profile?.telephone ?? 'N/A',
      'Téléphone pro':this.rowData?.permanent?.profile?.telephone_pro ?? 'N/A',
      'Courriel':this.rowData?.permanent?.profile?.email ?? 'N/A',
      'Commentaire':this.rowData?.permanent?.profile?.commentaire ?? 'N/A'
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data!);
    
  
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    // Save to file
    XLSX.writeFile(wb, nomFichier+'.xlsx');
  }
}
