import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Images } from 'docs/assets/data/images';
import { DataDepartement, DataPole, DataService, Pole } from 'src/app/_core/interface/interim';
import { DataALL } from 'src/app/_core/interface/permanent';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertType } from 'src/app/shared/components/alert/alert.type';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,AlertComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements AfterViewInit,OnInit
{
  readonly alertType = AlertType;
  service=inject(PermanentService);
  public userOne: string = Images.users.userOne;
  dataAll?:DataALL;
  poles:DataPole[]|undefined = [];
  departements:DataDepartement[]|undefined = [];
  services:DataService[]|undefined = [];
  responsable:boolean = true;
  formPermanent:FormGroup;
  fb = inject(FormBuilder);
  message:string="";
  autreStatut:boolean = false;
  autrePoste:boolean = false;
  autreGroupe:boolean = false;
  autreCategorie:boolean = false;
  autreAgence:boolean = false;
  autreLocau:boolean = false;
  autreCanal:boolean = false;
  autreDirection:boolean = false;
  autrePole:boolean = false;
  autreDepartement:boolean = false;
  autreService:boolean = false;
  notExistPole:boolean = true;
  notExistDepartement:boolean = true;
  notExistService:boolean = true;
  suitedirection :boolean =false;
  suitepole :boolean =false;
  suiteservice :boolean =false;
  image?:File 

  constructor( ){
    this.formPermanent = this.fb.group({
      prenom:[],
      nom:[],
      email:[],
      matricule:[],
      contrat:[],
      telephone:[],
      telephone_pro:[],
      adresse:[],
      avatar:[this.userOne],
      poste_id:[''],
      statut_id:[''],
      groupe_id:[''],
      categorie_id:[''],
      agence_id:[''],
      locau_id:[''],
      canal_id:[''],
      direction_id:[''],
      pole_id:[''],
      departement_id:[''],
      service_id:[''],
      responsable_id:['']
    })
  }
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.indexAll()
  }
  get avatars(){
    return this.formPermanent.get('avatar')?.value
  }
  indexAll()
  {
    this.service.indexAll().subscribe({
      next:(response=>{
        console.log(response);
        this.dataAll = response.data
        
      })
    })
  }
  choiceResponsable(event:Event){
    let option = (event.target as HTMLInputElement).checked;
    console.log(option);
    this.responsable  = !option
  }
  Autre(event:Event,cle:string){
   let autre = (event.target as HTMLSelectElement).value ==='Autre';      
      if(autre!=true){
        return
      }
      this.formPermanent.get(`${cle}`)?.setValue('')
      return autre;
  }
  selectedStatut(event:Event)
  {
     let autre =  this.Autre(event,'statut_id');
     if(autre===true){
      this.autreStatut = true
     } 
  }
  selectedPoste(event:Event)
  {
    let autre = this.Autre(event,'poste_id');
    if(autre===true){
      this.autrePoste = true;
    }
  }
  selectedGroupe(event:Event)
  {
   let autre = this.Autre(event,'groupe_id');
   if(autre===true){
    this.autreGroupe= true;
   }
  }
  selectedCategorie(event:Event)
  {
   let autre = this.Autre(event,'categorie_id');
   if(autre===true){
    this.autreCategorie= true;
   }
  }
  selectedAgence(event:Event)
  {
   let autre = this.Autre(event,'agence_id');
   if(autre===true){
    this.autreAgence = true;
   }
  }
  selectedLocau(event:Event)
  {
   let autre = this.Autre(event,'locau_id');
   if(autre===true){
    this.autreLocau = true;
   }
  }
  selectedCanal(event:Event)
  {
   let autre = this.Autre(event,'canal_id');
   if(autre===true){
    this.autreCanal = true;
   }
  }
  selectedDirection(event:Event)
  {
    console.log((event.target as HTMLSelectElement).value);
    this.poles = []
    let select =this.formPermanent.get('direction_id')?.value;
    if(select )
    {
      this.notExistPole = true
      if(select==="Autre")
      {
        let autre = this.Autre(event,'direction_id');
        if(autre===true)
        {
          this.autreDirection = true;
        }
      }else
      {
        this.suitedirection = true;  
      }
    }  
  }
  clickSuitedirection(){
    let select =this.formPermanent.get('direction_id')?.value;
    let data = this.dataAll?.directions.find(element=>element.libelle.toLowerCase() === select.libelle.toLowerCase())
      this.poles = data?.poles;
      if(this.poles?.length == 0){
        this.notExistPole = false
        console.log(this.poles);     
      }else{
        this.notExistPole = true;
        console.log(this.poles);        
      }
      this.suitedirection = false;
  }
  clickSuitepole()
  {
    let select = this.formPermanent.get('pole_id')?.value;
    let data = this.poles?.find(ele=>ele.libelle.toLowerCase() ===select.libelle.toLowerCase())
    this.departements = data?.departements;
    if(this.departements?.length ==0){
      this.notExistDepartement = false;
    }else{
      this.notExistDepartement = true;
    }
    this.suitepole = false;

  }
  clickSuitedepartement()
  {
    let departement = this.formPermanent.get('departement_id')?.value;
    let data = this.departements?.find(element=>element.libelle.toLowerCase()=== departement.libelle.toLowerCase());
    this.services = data?.services;
    if(this.services?.length== 0){
      this.notExistService = false;
    }else{
      this.notExistService = true
    }
    this.suiteservice = false;
  }
  selectedPole(event:Event){
    let select = this.formPermanent.get('pole_id')?.value;
    if(select){
      if(select==="Autre"){
        let autre = this.Autre(event,'pole_id');
        if(autre===true){
          this.autrePole = true;
          this.departements =[]
        }else{
        }
      }else{
       this.suitepole = true;
      }
    }
  }
  selectedDepartement(event:Event)
  {
    let departement = this.formPermanent.get('departement_id')?.value;
    if(departement){
      if(departement==="Autre"){
        let autre = this.Autre(event,'departement_id');
        if(autre===true){
          this.autreDepartement = true;
        }
      }else{
       this.suiteservice = true;

      }
    }
  }
  selectedService(event:Event){
    if(event){
      let autre = this.Autre(event,'service_id');
      if(autre===true){
        this.autreService = true;
      }
    }
  }
  selectedAvatar(event: Event)
  {
    let avatar = (event.target as HTMLInputElement).value;
    const image=event.target as HTMLInputElement;
    
    if(image.files && image.files.length>0){
      this.image =image.files[0];
      let reader=new FileReader();   
      reader.onload=()=>{
        const imageBase_64:string = reader.result as string
         this.formPermanent.get('avatar')?.setValue(imageBase_64);
      }
      reader.readAsDataURL(image.files[0]);
    }
  }
  enregistrer()
  {
    console.log(this.formPermanent.value);
    let poste = this.formPermanent.get('poste_id')?.value;
    let statut = this.formPermanent.get('statut_id')?.value;
    let groupe = this.formPermanent.get('groupe_id')?.value;
    let categorie = this.formPermanent.get('categorie_id')?.value;
    let agence = this.formPermanent.get('agence_id')?.value;
    let lieu = this.formPermanent.get('locau_id')?.value;
    let canal = this.formPermanent.get('canal_id')?.value;
    let direction = this.formPermanent.get('direction_id')?.value;
    let pole = this.formPermanent.get('pole_id')?.value;
    let departement = this.formPermanent.get('departement_id')?.value;
    let service = this.formPermanent.get('service_id')?.value;
    let responsable = this.formPermanent.get('responsable_id')?.value;
    if(poste && poste.id)
    {
      this.formPermanent.get('poste_id')?.setValue(poste.id)
    }
    if(statut && statut.id)
    {
      this.formPermanent.get('statut_id')?.setValue(statut.id)
    }
    if(groupe && groupe.id)
    {
      this.formPermanent.get('groupe_id')?.setValue(groupe.id)
    }
    if(categorie && categorie.id)
    {
      this.formPermanent.get('categorie_id')?.setValue(categorie.id)
    }
    if(agence && agence.id)
    {
      this.formPermanent.get('agence_id')?.setValue(agence.id)
    }
    if(lieu && lieu.id)
    {
      this.formPermanent.get('locau_id')?.setValue(lieu.id)
    }
    if(canal && canal.id)
    {
      this.formPermanent.get('canal_id')?.setValue(canal.id)
    }
    if(direction && direction.id)
    {
      this.formPermanent.get('direction_id')?.setValue(direction.id)
    }
    if(pole && pole.id)
    {
      this.formPermanent.get('pole_id')?.setValue(pole.id)
    }
    if(departement && departement.id)
    {
      this.formPermanent.get('departement_id')?.setValue(departement.id)
    }
    if(service && service.id)
    {
      this.formPermanent.get('service_id')?.setValue(service.id)
    }
    if(responsable && responsable.id)
    {
      this.formPermanent.get('responsable_id')?.setValue(responsable.id)
    }
  
    
    console.log(this.formPermanent.value);
    this.formPermanent.get('avatar')?.setValue(this.image);
    this.service.store(this.formPermanent.value).subscribe({
      next:(response=>{
        console.log(response);
        if(response.statut===200)
          {
            this.message = response.message;
          setTimeout(()=>{
            this.message =""
          },500)
        }
      })
    })
  }

}
