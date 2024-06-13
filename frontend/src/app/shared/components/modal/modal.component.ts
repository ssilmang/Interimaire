import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interim } from 'src/app/_core/interface/interim';
import { CommentaireComponent } from '../commentaire/commentaire.component';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule,CommentaireComponent]
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = "Modal";
  @Input() size: string = "xl:max-w-7xl";
  @Input() footer: boolean = true;
  @Input() dataInterim?:Interim
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() clickCommentaire = new EventEmitter<string>();
 
  showModal: boolean = false;
  enregistrer:boolean = true;
  annuler:boolean = true;
  modalCompnent: CommentaireComponent;
  couleur:string = "bg-red-600  hover:bg-red-500";

  constructor() {
    this.modalCompnent = new CommentaireComponent();
  }

  openModal(event:Event) 
  {
    let option = (event.target as HTMLButtonElement).textContent?.trim();
   this.enregistrer = false;
   this.annuler = false
   this.couleur = "bg-green-600  hover:bg-green-500"
    if(option)
    {
      this.clickCommentaire.emit(option)
    }
  }

  onModalCloseHandler(event: boolean) {
    this.showModal = event;
  }
  onModalClose() {
    this.show = false;
    this.enregistrer = true;
    this.annuler = true
    ;this.couleur ="bg-red-600  hover:bg-red-500";
    this.closeModal.emit(this.show);
  }
  
}

