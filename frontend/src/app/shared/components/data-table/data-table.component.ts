import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { ModalModule } from '../modal/modal.module';
import { FormsModule } from '@angular/forms';
import { InterimService } from 'src/app/_core/services/interim.service';

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [NgClass, NgIf,ModalModule,FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
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
  commentaire:string = "huhuhouho";
  constructor(private service:InterimService){
    this.modalCompnent = new ModalComponent();
  }
  sortingUp() {
    this.shorting = !this.shorting;
  }
  sortingDown() {
    this.shorting = !this.shorting;
  }
  afficherDetails(collab?: Permanent) {
    console.log(collab);
    
    this.dataDetails= collab;
    this.showModal = !this.showModal;
    this.faireCommentaire = true
    // Mettez en œuvre la logique pour afficher les détails du collaborateur
  }
  onModalCloseHandler(event: boolean) {
    this.showModal = event;
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
    this.rowData = collab;

  }
  clickCommentaire(event:string)
  {
    this.faireCommentaire = false;
    let string = "Enregistrer";   
    console.log(event.toLowerCase() === string.toLowerCase());  
    if(event.toLowerCase() === string.toLowerCase())
      {
        console.log( this.commentaire); 
        console.log(this.dataDetails  );
        let idUser = this.dataDetails?.profile.id;
        const data = {
          commentaire:this.commentaire
          };
        this.service.isCommentaire(data,idUser!).subscribe({
          next:(response=>{
            console.log(response);
            
            if(response.statut==200)
            {
             if(this.dataDetails?.profile){
              this.dataDetails.profile = response.data
             }
              this.showModal =false
              this.faireCommentaire = true
            }

          })
        })
      }else{
        this.commentaire = this.dataDetails?.profile.commentaire!
      }
      this.commentaire == "jgkhkgkihi"
  }
}
