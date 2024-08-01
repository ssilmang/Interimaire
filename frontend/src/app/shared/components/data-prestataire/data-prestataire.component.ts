import {  CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { ModalModule } from '../modal/modal.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { InterimService } from 'src/app/_core/services/interim.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { map, Observable, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RechercherLibellePipe } from 'src/app/admin/pipe/rechercher-libelle.pipe';

@Component({
  selector: 'data-prestataire',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ModalModule,
    FormsModule,
    RouterLink,
    MatInputModule,
    MatAutocompleteModule,
    RechercherLibellePipe,
  ],
  templateUrl: './data-prestataire.component.html',
  styleUrl: './data-prestataire.component.css'
})
export class DataPrestataireComponent implements OnInit {
  @Input() columnData: any = [];
  @Input() rowData: Permanent[]=[];
  @Input() pageData: number[] = [];
  @Input() currentPage!:number;
  @Input() taille!:number;
  @Input() total!:number;
  shorting: boolean = false;
  showModal:boolean = false;
  isDropdownOpen:boolean = true;
  dataDetails?:Permanent;
  collaborateur?:Permanent;
  modalCompnent: ModalComponent;
  faireCommentaire:boolean = true;
  apiImag = environment.apiPrestataire
  isCommentaire:boolean = false
  couleur:string = "bg-red-600  hover:bg-red-700"
  commentaire:string = "";
  annuler: boolean = true;
  hiddern:string = 'hidden';
  myControl=new FormControl('4');
  options: string[] = ['4','9','15','20','30','40','50','60','70','80','90','100'];
  filteredOptions!: Observable<string[]>;
  libelle:string='';
  constructor(private service :InterimService,private shared:LocalStorageService,private router:Router){
    this.modalCompnent = new ModalComponent();
  }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options;
  }
  afficherDetails(collab?: Permanent) {
    this.dataDetails= collab;
    this.showModal = !this.showModal;
    this.faireCommentaire = true
  }
  onModalCloseHandler(event: boolean) {
    this.showModal = event;
    this.faireCommentaire = true
    this.annuler = true
    this.isCommentaire = false;
    this.couleur =  "bg-red-600  hover:bg-red-700"
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen);
  }
  toggleAccordion(permanent:Permanent,index: number) { 
    permanent.status = !permanent.status;
  }
  afficheChefService(collab?:Permanent)
  {
    this.collaborateur = collab;
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
  editer(permanent?:Permanent){
    this.shared.changeInterim(permanent);
    this.router.navigateByUrl('/admin/elements/forms');
  }
  getUserInitials(prenom:string,nom:string):string {
    if (!prenom || !nom) return '';

    const initials = prenom.charAt(0).toUpperCase() + nom.charAt(0).toUpperCase();
    return initials;
  }
  export(){
    this.hiddern = 'block';
  }
  valider(){
    this.shared.chargerExport('null','prestataires','null');
    this.hiddern = 'hidden';
  }
  close()
  {
    this.hiddern = 'hidden';
  }
  selectPage=(page:number):void=>
    {
      this.currentPage=page;
      const data={
        taille:this.taille,
        currentPage:this.currentPage
      } 
      this.shared.chargePaginate(data);
    }
    PageTailleChange=(event: Event): void =>
      { 
        
        let nmbre = (event.target as HTMLInputElement).value;
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
      const data={
        taille:this.taille,
        currentPage:this.currentPage
      }
      this.shared.chargePaginate(data);
      }
      prevPage=(): void=>
     {
        if (this.currentPage > 1)
       {
          this.currentPage--;
          const data={
            taille:this.taille,
            currentPage:this.currentPage
          }
          this.shared.chargePaginate(data);
        }
      }
      nextPage=(): void=>
     {
        if (this.currentPage < this.pageData.length)
        {
          this.currentPage++;
          const data={
            taille:this.taille,
            currentPage:this.currentPage
          }
          this.shared.chargePaginate(data);
        }
      }
}
