import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interim } from 'src/app/_core/interface/interim';

@Component({
  selector: 'app-commentaire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commentaire.component.html',
  styleUrl: './commentaire.component.css'
})
export class CommentaireComponent {
  @Input() show: boolean = false;
  @Input() title: string = "Modal";
  @Input() size: string = "xl:max-w-7xl";
  @Input() footer: boolean = true;
  @Input() dataInterim?:Interim
  @Output() closeModal = new EventEmitter<boolean>();
  modalCommentaire()
  {

  }
  onModalClose() {
    this.show = false;
    this.closeModal.emit(this.show);
  }
}
