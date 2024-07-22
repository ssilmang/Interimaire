import {  CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { ModalModule } from '../modal/modal.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { InterimService } from 'src/app/_core/services/interim.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'data-prestataire',
  standalone: true,
  imports: [NgClass,CommonModule,NgIf,ModalModule,FormsModule,RouterLink],
  templateUrl: './data-prestataire.component.html',
  styleUrl: './data-prestataire.component.css'
})
export class DataPrestataireComponent {
  @Input() columnData: any = [];
  @Input() rowData: Permanent[]=[];
  @Input() pageData: number[] = [];
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
  constructor(private service :InterimService,private shared:LocalStorageService,private router:Router){
    this.modalCompnent = new ModalComponent();
  }
  afficherDetails(collab?: Permanent) {
    console.log(collab);
    
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
}
