import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Interim } from 'src/app/_core/interface/interim';
import { InterimService } from 'src/app/_core/services/interim.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
@Component({
  selector: 'app-diolag-remplacement',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,ReactiveFormsModule,CommonModule,AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diolag-remplacement.component.html',
  styleUrl: './diolag-remplacement.component.css'
})
export class DiolagRemplacementComponent implements OnInit,AfterViewInit{
 formRemplace:FormGroup
 message:string=""
 numeroTelephone:string=''
 numeroTelephonePro:string=""
  constructor(private service:InterimService,private fb:FormBuilder,private dialogRef:MatDialogRef<DiolagRemplacementComponent>,@Inject(MAT_DIALOG_DATA) public interim:Interim){
    this.formRemplace = this.fb.group({
      prenom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      nom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      email:['',[Validators.required,Validators.email]],
      matricule:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z0-9]*$")]],
      contrat:[],
      telephone:['',[Validators.required,Validators.minLength(9),Validators.maxLength(12),Validators.pattern(/^(77|78|76|75|70)[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/)]],
      telephone_pro:[],
      adresse:[],
      date_debut_contrat:['',[Validators.required,this.DateDebutValidator]],
      date_fin_contrat:['',[Validators.required,this.DateFinValidator]],
      temps_presence_autre_structure_sonatel:['',[Validators.required]],
      DA:['',[Validators.required]],
      DA_kangourou:['',[Validators.required]],
      poste:[''],
      statut:[''],
      locau:[''],
      responsable:[''],
      categorieInterim:[''],
    })
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  DateDebutValidator(control: AbstractControl): { [key: string]: boolean} | null {
    const debut = new Date(control.value);
    const fin = new Date(control.parent?.get('date_fin_contrat')?.value);
    const dateActuel = new Date();
    // if(debut < dateActuel ){
    //   return {'error':true};
    // }
    // dateActuel.setDate(dateActuel.getDate()+3);
    // if(debut <dateActuel){
    //   return {'trois':true};
    // }
    if (debut && fin) {
      if (debut >= fin ) {
        return { 'hors': true };
      }
    }
    return null;
  }
  DateFinValidator(control: AbstractControl): { [key: string]: boolean} | null {
    const fin = new Date(control.value);
    const debut = new Date(control.parent?.get('date_debut_contrat')?.value); 
    const autreStructure = control.parent?.get('temps_presence_autre_structure_sonatel')?.value;
    if (debut && fin) {
      const diffMillisecondes = fin.getTime() - debut.getTime();
      const autreStructureEnAnnee = autreStructure /12;
      const deuxAns = diffMillisecondes /(1000 * 60 * 60 * 24 *365.25) + autreStructureEnAnnee;
      if (debut >= fin ) {
        return { 'hors': true };
      }if( deuxAns >2){
        return {'error':true}
      }
    }
    return null;
  }
  enregistrer(){
    const data:FormData = new FormData();
    this.formRemplace.get('poste')?.setValue(this.interim.poste.id)
    this.formRemplace.get('statut')?.setValue(this.interim.statut.id)
    this.formRemplace.get('categorieInterim')?.setValue(this.interim.categorie.id)
    this.formRemplace.get('locau')?.setValue(this.interim.locau.id)
    this.formRemplace.get('responsable')?.setValue(this.interim.responsable.id)
    let da = this.formRemplace.get('DA')?.value.trim().replace(/\s/g,'');
    this.formRemplace.get('DA')?.setValue(da)
    let da_kangourou = this.formRemplace.get('DA_kangourou')?.value.trim().replace(/\s/g,'');
    this.formRemplace.get('DA_kangourou')?.setValue(da_kangourou)
    this.formRemplace.get('telephone')?.setValue(this.numeroTelephone);
    
    // this.service.remplacer(this.formRemplace.value,this.interim.profile.id).subscribe({
    //  next: (response)=>{
    //     console.log(response);
    //     if(response.statut==200){
    //       this.message = response.message
    //       this.dialogRef.close(response);
    //       setTimeout(()=>{
    //         this.message = "",
    //         this.dialogRef.close();
    //       },5000)
    //     }
    //   }
    // })
    console.log(this.formRemplace.value);
    
  }
 
  formatSpaces(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  numberSpace(event:Event):void
  {
    let value = (event.target as HTMLInputElement).value.trim().replace(/\s/g,'');
    if(isNaN(parseInt(value))){
      (event.target as HTMLInputElement).value =""
    }else{
      let formattedValue = this.formatSpaces(parseInt(value));
      (event.target as HTMLInputElement).value = formattedValue;
    }
  }
  getNumber(value: number): string 
  {
    return this.formatSpaces(value);
  }
  getPro(event:Event)
  {
    let inputElement = (event.target as HTMLInputElement);
    let value = inputElement.value.replace(/[\s.-]/g, '');
    value = value.replace(/\D/g,'');
    this.format(value,/^(33)\d{7}$/,inputElement,this.numeroTelephonePro);
  }
  getnum(event: Event): void 
  {
    let inputElement = (event.target as HTMLInputElement);
    let value = inputElement.value.replace(/[\s.-]/g, '');
    value = value.replace(/\D/g, '');
   this.format(value,/^(77|78|76|70|75)\d{7}$/,inputElement,this.numeroTelephone);
  }
  format(value:string,caract:RegExp,inputElement:HTMLInputElement,numeroTelephone:string)
  {
    if(isNaN(parseInt(value)))
    {
      inputElement.value =""
      return
    }  
      if(value.length<=9)
      {
        if (caract.test(value))
        {
          const formattedNumber = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
          inputElement.value = formattedNumber;
        }else 
        {  
           inputElement.value =value  
        }
      }else
      {
        inputElement.value = value.slice(0,9).replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
      if(value.length===9)
      {
      numeroTelephone=value;
      }
  }
  
}
