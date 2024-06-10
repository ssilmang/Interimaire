import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Images } from 'src/assets/data/images';
import { DataDepartement, DataPole, DataService, Pole } from 'src/app/_core/interface/interim';
import { DataALL } from 'src/app/_core/interface/permanent';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,AlertComponent,CommonModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements AfterViewInit,OnInit
{
  readonly alertType = AlertType;
  service=inject(PermanentService);
  public userOne: string = Images.photo.img;
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
  image:File|null=null; 

  constructor( ){
    this.formPermanent = this.fb.group({
      prenom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      nom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      email:['',[Validators.required,Validators.email]],
      matricule:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z0-9]*$")]],
      contrat:[],
      telephone:['',[Validators.required,Validators.minLength(9),Validators.maxLength(12),Validators.pattern("^[0-9]*$")]],
      telephone_pro:[],
      adresse:[],
      photo:[this.userOne,[Validators.required]],
      poste_id:['',[Validators.required]],
      statut_id:['',[Validators.required]],
      groupe_id:['',[Validators.required]],
      categorie_id:['',[Validators.required]],
      agence_id:['',[Validators.required]],
      locau_id:['',[Validators.required]],
      canal_id:['',[Validators.required]],
      direction_id:['',[Validators.required]],
      pole_id:['',[Validators.required]],
      departement_id:['',[Validators.required]],
      service_id:['',[Validators.required]],
      responsable_id:['',[Validators.required]]
    })
  }
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.indexAll()
  }
  get avatars(){
    return this.formPermanent.get('photo')?.value
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
  selectedPole(event:Event)
  {
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
         this.formPermanent.get('photo')?.setValue(imageBase_64);
         console.log(imageBase_64);
         
         
      }
      reader.readAsDataURL(image.files[0]);
    }
  }
  enregistrer()
  {
    console.log(this.formPermanent.value);
    const formData :FormData = new FormData();
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
     formData.append('poste_id',poste.id)
    }else{
      formData.append('poste_id',this.formPermanent.get('poste_id')?.value)
    }
    if(statut && statut.id)
    {
      formData.append('statut_id',statut.id)
    }else{
      formData.append('statut_id',this.formPermanent.get('statut_id')?.value)
    }
    if(groupe && groupe.id)
    {
      formData.append('groupe_id',groupe.id)
    }else{
      formData.append('groupe_id',this.formPermanent.get('groupe_id')?.value)
    }
    if(categorie && categorie.id)
    {
     formData.append('categorie_id',categorie.id)
    }else{
      formData.append('categorie_id',this.formPermanent.get('categorie')?.value)
    }
    if(agence && agence.id)
    {
      formData.append('agence_id',agence.id)
    }else{
      formData.append('agence_id',this.formPermanent.get('agence_id')?.value)
    }
    if(lieu && lieu.id)
    {
      formData.append('locau_id',lieu.id)
    }else{
      formData.append('locau_id',this.formPermanent.get('locau_id')?.value)
    }
    if(canal && canal.id)
    {
      formData.append('canal_id',canal.id)
    }else{
      formData.append('canal_id',this.formPermanent.get('canal_id')?.value)
    }
    if(direction && direction.id)
    {
      formData.append('direction_id',direction.id)
    }else{
      formData.append('direction_id',this.formPermanent.get('direction_id')?.value)
    }
    if(pole && pole.id)
    {
      formData.append('pole_id',pole.id)
    }else{
      formData.append('pole_id',this.formPermanent.get('pole_id')?.value)
    }
    if(departement && departement.id)
    {
      formData.append('departement_id',departement.id)
    }else{
      formData.append('departement_id',this.formPermanent.get('departement_id')?.value)
    }
    if(service && service.id)
    {
      formData.append('service_id',service.id)
    }else{
      formData.append('service_id',this.formPermanent.get('service_id')?.value)
    }
    if(responsable && responsable.id)
    {
      formData.append('responsable_id',responsable.id)
    }
    if(this.image){
      formData.append('photo',this.image,this.image?.name);
      formData.append('nom',this.formPermanent.get('nom')?.value);
      formData.append('prenom',this.formPermanent.get('prenom')?.value);
      formData.append('matricule',this.formPermanent.get('matricule')?.value);
      formData.append('email',this.formPermanent.get('email')?.value);
      formData.append('contrat',this.formPermanent.get('contrat')?.value);
      formData.append('adresse',this.formPermanent.get('adresse')?.value);
      formData.append('telephone',this.formPermanent.get('telephone')?.value);
      formData.append('telephone_pro',this.formPermanent.get('telephone_pro')?.value);
  }
    this.service.store(formData).subscribe({
      next:(response=>{
        console.log(response);
        if(response.statut===200)
          {
            this.message = response.message;
          setTimeout(()=>{
            this.message =""
          },5000)
          this.formPermanent.reset();
          this.formPermanent.get('photo')?.setValue(this.userOne);
          this.responsable =false;
        }
      })
    })
  }
}
