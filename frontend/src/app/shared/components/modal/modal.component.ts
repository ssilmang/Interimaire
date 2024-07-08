import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interim } from 'src/app/_core/interface/interim';
import { CommentaireComponent } from '../commentaire/commentaire.component';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule,CommentaireComponent,NgClass]
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Input() rompre: boolean = false;
  @Input() title: string = "Modal";
  @Input() size: string = "xl:max-w-7xl";
  @Input() footer: boolean = true;
  @Input() close:boolean = true;
  @Input() dataInterim?:Interim
  @Input() premierButtonText: string = 'Commentaire';
  @Input() deuxiemeButtonText: string = 'Fermer';
  @Input() couleur:string = "bg-red-600  hover:bg-red-500";
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() closeModalRompre = new EventEmitter<boolean>();
  @Output() clickCommentaire = new EventEmitter<string>();
  @Output() clickRompre = new EventEmitter<boolean>();
  @Output() clickButton = new EventEmitter<void>();
  @Output() clickPoint = new EventEmitter<void>();
  showModal: boolean = false;
  enregistrer:boolean = true;
  annuler:boolean = true;
  modalCompnent: CommentaireComponent;
  constructor() {
    this.modalCompnent = new CommentaireComponent();
  }
  openModal(event:Event) 
  {
    let option = (event.target as HTMLButtonElement).textContent?.trim();
   this.annuler = false
    if(option)
    {
      this.clickCommentaire.emit(option)
    }
    this.clickButton.emit();
  }
  onModalCloseHandler(event: boolean) {
    this.showModal = event;
  }
  onModalClose() {
    this.show = false;
    this.annuler = true
    this.closeModal.emit(this.show);
  }
}

