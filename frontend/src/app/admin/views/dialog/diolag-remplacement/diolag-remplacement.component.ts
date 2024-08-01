import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule,MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-diolag-remplacement',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,ReactiveFormsModule,CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diolag-remplacement.component.html',
  styleUrl: './diolag-remplacement.component.css'
})
export class DiolagRemplacementComponent implements OnInit,AfterViewInit{
 formRemplace:FormGroup
  constructor(private fb:FormBuilder){
    this.formRemplace = this.fb.group({
      prenom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      nom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      email:['',[Validators.required,Validators.email]],
      matricule:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z0-9]*$")]],
      contrat:[],
      telephone:['',[Validators.required,Validators.minLength(9),Validators.maxLength(12),Validators.pattern("^[0-9]*$")]],
      telephone_pro:[],
      adresse:[],
      date_debut_contrat:['',[Validators.required,this.DateDebutValidator]],
      date_fin_contrat:['',[Validators.required,this.DateFinValidator]],
      temps_presence_autre_structure_sonatel:['',[Validators.required]],
      DA:['',[Validators.required]],
      DA_kangourou:['',[Validators.required]],

    })
  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    
  }
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
    console.log("oui");
    
  }
}
