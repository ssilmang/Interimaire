import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';

@Component({
  selector: 'app-dialog-exprt',
  standalone: true,
  imports: [],
  templateUrl: './dialog-exprt.component.html',
  styleUrl: './dialog-exprt.component.css'
})
export class DialogExprtComponent {
constructor(public dialogRef: DialogRef,private shared:LocalStorageService){

}
  enCours=()=>{
  this.shared.clickIci('encours')
 this.dialogRef.close();
  
  }
  global=()=>{
    this.shared.clickIci('global');
   this.dialogRef.close()
    
  }
}
