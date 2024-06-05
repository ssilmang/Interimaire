import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Permanent } from 'src/app/_core/interface/permanent';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { pageTransition } from 'src/app/shared/utils/animations';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-permanent',
  standalone: true,
  imports: [CommonModule,ModalModule],
  templateUrl: './permanent.component.html',
  styleUrl: './permanent.component.css',
  animations:[pageTransition],
})
export class PermanentComponent implements OnInit {
  chefServiceVisible = false;
  collaborateurServiceVisible = false;
  dataDV?:Permanent;
  dataDetails?:Permanent;
  apiImg=environment.apiImg;
  pole:boolean=true;
  collaborateur?:Permanent;
  support:string ="support";
  showModal:boolean = false;
  isDropdownOpen:boolean = true;
  modalCompnent: ModalComponent;
  constructor(private service:PermanentService){
    this.modalCompnent = new ModalComponent();
  }
  
  ngOnInit(): void {
    this.indexPermanent();
  }
  
  
  afficherDetails(collab?: Permanent) {
    this.dataDetails= collab;
    this.showModal = !this.showModal;
    // Mettez en œuvre la logique pour afficher les détails du collaborateur
  }
  onModalCloseHandler(event: boolean) {
    this.showModal = event;
  }
  indexPermanent()
  {
    this.service.indexPermanents().subscribe({
      next:(response=>{
        this.dataDV = response.data.dvs
        console.log(response);
      })
    })
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
    this.dataDV = collab;

  }

}
