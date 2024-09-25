import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Images } from 'src/assets/data/images';
import { Agence, DataDepartement, DataPole, DataService, Pole, Role } from 'src/app/_core/interface/interim';
import { DataALL, Permanent } from 'src/app/_core/interface/permanent';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { environment } from 'src/environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    AlertComponent,
    CommonModule,
    RouterLink
  ],
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
  dataAgence?:Agence;
  responsable:boolean = true;
  formPermanent:FormGroup;
  fb = inject(FormBuilder);
  apiImag = environment.apiInterim;
  apiImagPermanent = environment.apiImg;
  apiImagPrestataire = environment.apiPrestataire;
  message:string ="";
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
  suitedirection :boolean = false;
  suitepole :boolean = false;
  suiteservice :boolean = false;
  image:File|null = null; 
  interimaire:boolean = false;
  messageError:string = ""
  messageAttention:string = "";
  messageInfo:string = "";
  commercialExiste:boolean = false;
  autreCommercial:boolean = true;
  interimCategorie:boolean = false
  enregistre:string = "Enregistrer";
  color:string = 'btn-primary';
  idInterim:number = 0;
  idProfile:number = 0;
  contrat_id:number = 0;
  imageUpdate:string = "";
  upload:string = "";
  showModal:boolean = true;
  footer: boolean = false;
  close:boolean = false;
  visible:boolean = false;
  kangourou:boolean = false;
  numeroTelephone:string = "";
  numeroTelephonePro:string ='';
  profileChange?:Permanent;
  profileChanged?:Permanent;
  show:boolean = false;
  remplacer_id:number = 0;
  dataPole?:Role[] 
  dataDepartement?:Role[] 
  dataService?:Role[]
  isEditer:boolean=false;
  isEditDepartement:boolean=false;
  isEditService:boolean=false;
  @ViewChild('checkboxRef',{static:false}) checkboxRef!:ElementRef<HTMLInputElement>;
  constructor(
    private sharedService:LocalStorageService,
    private cdRef:ChangeDetectorRef,
    private cref : DestroyRef
   )
  {
     this.formPermanent = this.fb.group(
    {
      prenom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      nom:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern("^[A-Za-z\\sé^']*$")]],
      email:['',[Validators.required,Validators.email]],
      matricule:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[A-Za-z0-9]*$")]],
      contrat:[],
      telephone:['',[Validators.required,Validators.minLength(9),Validators.maxLength(12),Validators.pattern("^[0-9]*$")]],
      telephone_pro:[],
      adresse:[],
      photo:[this.userOne,[Validators.required]],
      poste:['',[Validators.required]],
      statut:['',[Validators.required]],
      groupe:['',[Validators.required]],
      categorie:['',[Validators.required]],
      agence:['',[Validators.required]],
      locau:['',[Validators.required]],
      canal:['',[Validators.required]],
      direction:['',[Validators.required]],
      pole:['',[Validators.required]],
      departement:['',[Validators.required]],
      service:['',[Validators.required]],
      agence_commercial:['',[Validators.required]],
      responsable:['',[Validators.required]],
      categorieInterim:['',[Validators.required]],
      date_debut_contrat:['',[Validators.required,this.DateDebutValidator]],
      date_fin_contrat:['',[Validators.required,this.DateFinValidator]],
      temps_presence_autre_structure_sonatel:['',[Validators.required]],
      DA:['',[Validators.required]],
      DA_kangourou:['',[Validators.required]],
      duree_kangourou:['',[Validators.required]],
      montant_kangourou:['',[Validators.required]],
      interimaireCategorie:['',Validators.required],
      cout_unitaire:['',Validators.required],
    })
  }
  ngOnInit(): void
  {  
    this.index() 
  }
  ngAfterViewInit(): void
  {

    this.sharedService.currentInterim.pipe(takeUntilDestroyed(this.cref)).subscribe(interim=>{
      if(interim){ 
        console.log(interim);
        
        this.profileChanged = interim;
        this.formPermanent.reset();
        
        this.formPermanent.patchValue(interim)
        this.enregistre = "Modifier";
        this.color = "btn-success";
        this.idInterim=interim.id;
        this.idProfile = interim.profile.id;
        
        if (interim.responsable && interim.responsable.id)
        {
          this.responsable  = false
          this.checkboxRef.nativeElement.checked =true;
        }
        if(interim.statut.libelle ==="Interimaire")
        {
          this.contrat_id = interim.contrats.id;
          this.interimaire = true;
          this.kangourou =true;
          this.formPermanent.get('date_debut_contrat')?.patchValue(interim.contrats.date_debut_contrat)
          this.interimCategorie =true;
          this.sharedService.currentAgence.pipe(takeUntilDestroyed(this.cref)).subscribe(element=>{
            this.dataAgence=element.find((ele:any)=>ele.id === interim.categorie.agence.id) 
            this.formPermanent.get('agence')?.patchValue(interim.categorie.agence)
            this.formPermanent.get('categorieInterim')?.patchValue(interim.categorie)     
          })
          this.formPermanent.get('date_fin_contrat')?.patchValue(interim.contrats.date_fin_contrat)
          this.formPermanent.get('temps_presence_autre_structure_sonatel')?.patchValue(interim.contrats.temps_presence_autre_structure_sonatel)
          this.formPermanent.get('DA')?.patchValue(interim.contrats.DA)
          this.formPermanent.get('DA_kangourou')?.patchValue(interim.contrats.DA_kangourou)
          this.formPermanent.get('duree_kangourou')?.patchValue(interim.poste.duree_kangurou)
          this.formPermanent.get('montant_kangourou')?.patchValue(interim.poste.montant_kangurou)
          
          this.formPermanent.get('photo')?.patchValue( this.apiImag + interim.profile.photo)
        }
        else if(interim.statut.libelle==="Permanent"){       
          this.formPermanent.get('photo')?.patchValue( this.apiImagPermanent + interim.profile.photo)
        }else if(interim.statut.libelle==="Prestataire"){
          this.formPermanent.get('photo')?.patchValue( this.apiImagPrestataire + interim.profile.photo)
        }
        this.formPermanent.get('prenom')?.patchValue(interim.profile.prenom)
        this.formPermanent.get('nom')?.patchValue(interim.profile.nom)
        this.formPermanent.get('matricule')?.patchValue(interim.profile.matricule)
        this.formPermanent.get('email')?.patchValue(interim.profile.email)    
        this.imageUpdate=interim.profile.photo;
        this.formPermanent.get('telephone')?.patchValue(interim.profile.telephone)
        this.formPermanent.get('telephone_pro')?.patchValue(interim.profile.telephone_pro)
        this.formPermanent.get('adresse')?.patchValue(interim.profile.adresse)
        if(interim.pole){
          this.notExistPole = true;     
          this.autrePole = false ;
          this.isEditer = true
        }
        if(interim.departement){
          this.isEditDepartement = true;
          this.notExistDepartement = true;
          this.autreDepartement = false;
        }
        if(interim.service){
          this.isEditService = true;
          this.notExistService = true;
          this.autreService = false;
        }  
        this.cdRef.detectChanges();
      }
    })
    this.sharedService.currentChange.pipe(takeUntilDestroyed(this.cref)).subscribe(change=>{
     if(change)
      {
        this.profileChange = change;
        this.remplacer_id = change.profile.id;
        if(this.remplacer_id)
        {
            this.enregistre = "Remplacer";
        }
          this.formPermanent.get('poste')?.setValue(change.poste);
          this.formPermanent.get('responsable')?.setValue(change.responsable);
          this.cdRef.detectChanges();
     }
    })
  }
 
  compare=function(option:any,value:any)
  { 
    return option && value ? option.id === value.id : option===value
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
  get avatars(){
    return this.formPermanent.get('photo')?.value
  }
  index()
  {
    this.service.indexAll().subscribe({
      next:(response=>{
        console.log(response);
        this.dataAll = response.data; 
        this.dataPole = this.dataAll?.poles
        this.dataDepartement = this.dataAll?.departements;
        this.dataService = this.dataAll?.services
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
    let option = this.formPermanent.get('statut')?.value;
     let autre =  this.Autre(event,'statut');
     if(autre===true){
      this.autreStatut = true
     }
     if(option && option.id){
       console.log(option);
       let val ="interimaire";
      if(option.libelle.toLowerCase()===val.toLowerCase()){
        this.interimaire = true
      }else{
        this.interimaire = false;
      }
     }
  }
  selectedPoste(event:Event)
  {
    let autre = this.Autre(event,'poste');
    if(autre===true){
      this.autrePoste = true;
      this.kangourou = true;
    }
  }
  selectedGroupe(event:Event)
  {
   let autre = this.Autre(event,'groupe');
   if(autre===true){
    this.autreGroupe= true;
   }
  }
  selectedCategorie(event:Event)
  {
   let autre = this.Autre(event,'categorie');
   if(autre===true){
    this.autreCategorie= true;
   }
  }
  selectedAgence(event:Event)
  {
    let select =this.formPermanent.get('agence')?.value;
    let autre = this.Autre(event,'agence');
    if(autre===true){
      this.autreAgence = true;
    }else{
    if(select){
      this.dataAgence=this.dataAll?.agences.find(element=>element.libelle.toLowerCase() === select.libelle.toLowerCase()) 
      if(this.dataAgence?.categories.length!==0){
        this.interimCategorie = true
      }else{
        this.interimCategorie =false
      }
    }
   }
  }
  selectedLocau(event:Event)
  {
   let autre = this.Autre(event,'locau');
   if(autre===true){
    this.autreLocau = true;
   }
  }
  selectedCanal(event:Event)
  {
   let autre = this.Autre(event,'canal');
   if(autre===true){
    this.autreCanal = true;
   }
  }
  selectedDirection(event:Event)
  {
    console.log((event.target as HTMLSelectElement).value);
    let select =this.formPermanent.get('direction')?.value;
    if(select )
    {
      this.notExistPole = true
      if(select==="Autre")
      {
        let autre = this.Autre(event,'direction');
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
    let select =this.formPermanent.get('direction')?.value;
    let data = this.dataAll?.directions.find(element=>element.libelle.toLowerCase() === select.libelle.toLowerCase())
      this.poles = data?.poles;
      this.dataPole = this.dataAll?.poles; 
      if(this.poles?.length == 0){
        this.notExistPole = false    
      }else{
        this.notExistPole = true;     
        this.autrePole = false  
      }
      this.suitedirection = false;
  }
  clickSuitepole()
  {
    let select = this.formPermanent.get('pole')?.value;
    let data = this.poles?.find(ele=>ele.libelle.toLowerCase() ===select.libelle.toLowerCase())
    this.departements = data?.departements;
    this.dataDepartement = this.dataAll?.departements
    if(this.departements?.length ==0){
      this.notExistDepartement = false;
    }else{
      this.notExistDepartement = true;
      this.autreDepartement = false;
    }
    this.suitepole = false;
  }
  clickSuitedepartement()
  {
    let departement = this.formPermanent.get('departement')?.value;
    let data = this.departements?.find(element=>element.libelle.toLowerCase()=== departement.libelle.toLowerCase());
    this.dataService = this.dataAll?.services;
      this.commercialExiste = false;
      this.autreService = true
      this.services = data?.services;    
      console.log(this.services);
    if(this.services?.length== 0){
      this.notExistService = false;
    }else{
      this.notExistService = true;
      this.autreCommercial = false;
      this.autreService = false;
    }
    this.suiteservice = false;
  }
  selectedPole(event:Event)
  {
    let select = this.formPermanent.get('pole')?.value;
    if(select){
      if(select==="Autre"){
        let autre = this.Autre(event,'pole');
        if(autre === true){
          this.autrePole = true;
          this.departements =[]
        }else{
          this.autrePole = false;
        }
      }else{

       this.suitepole = true;
      }
    }
  }
  selectedDepartement(event:Event)
  {
    let departement = this.formPermanent.get('departement')?.value;
    if(departement){
      if(departement==="Autre"){
        let autre = this.Autre(event,'departement');
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
      let autre = this.Autre(event,'service');
      if(autre===true){
        this.autreService = true;
      }
    }
  }
  selectedCommercial(event:Event){
    if(event){
      let autre = this.Autre(event,'service');
      if(autre===true){
        this.autreCommercial = true;
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
  getNumber(value: number|undefined): string 
  {
    if(value===undefined || value==null)
      return '0'
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
  valider(event:string)
  {
     this.enregistrer()
     this.show = !this.show;
     this.enregistre = "Enregistrer";
  }
  closed(event:boolean)
  {
    this.show = event;
  }
  save=(event:Event)=>{
    let button = (event.target as HTMLButtonElement).textContent;
    if(button?.toLowerCase()=="Remplacer".toLowerCase())
    {
      this.show = !this.show;
    }else{
      this.enregistrer()
    }
  }
  enregistrer=()=>
  {
    const formData :FormData = new FormData();
    let poste = this.formPermanent.get('poste')?.value;
    let statut = this.formPermanent.get('statut')?.value;
    let groupe = this.formPermanent.get('groupe')?.value;
    let categorie = this.formPermanent.get('categorie')?.value;
    let agence = this.formPermanent.get('agence')?.value;
    let lieu = this.formPermanent.get('locau')?.value;
    let canal = this.formPermanent.get('canal')?.value;
    let direction = this.formPermanent.get('direction')?.value;
    let pole = this.formPermanent.get('pole')?.value;
    let departement = this.formPermanent.get('departement')?.value;
    let service = this.formPermanent.get('service')?.value;
    let responsable = this.formPermanent.get('responsable')?.value;
    let agence_commercial = this.formPermanent.get('agence_commercial')?.value;
    if(poste && poste.id)
    {
     formData.append('poste',poste.id)
    }else{
      formData.append('poste',this.formPermanent.get('poste')?.value)
    }
    if(statut && statut.id)
    {
      formData.append('statut',statut.id)
    }else{
      formData.append('statut',this.formPermanent.get('statut')?.value)
    }
    if(groupe && groupe.id)
    {
      formData.append('groupe',groupe.id)
    }else{
      formData.append('groupe',this.formPermanent.get('groupe')?.value)
    }
    if(categorie && categorie.id)
    {
     formData.append('categorie',categorie.id)
    }else{
      formData.append('categorie',this.formPermanent.get('categorie')?.value)
    }
    if(agence && agence.id)
    {
      formData.append('agence',agence.id)
    }else{
      formData.append('agence',this.formPermanent.get('agence')?.value)
    }
    if(lieu && lieu.id)
    {
      formData.append('locau',lieu.id)
    }else{
      formData.append('locau',this.formPermanent.get('locau')?.value)
    }
    if(canal && canal.id)
    {
      formData.append('canal',canal.id)
    }else{
      formData.append('canal',this.formPermanent.get('canal')?.value)
    }
    if(direction && direction.id)
    {
      formData.append('direction',direction.id)
    }else{
      formData.append('direction',this.formPermanent.get('direction')?.value)
    }
    if(pole && pole.id)
    {
      formData.append('pole',pole.id)
    }else{
      formData.append('pole',this.formPermanent.get('pole')?.value)
    }
    if(departement && departement.id)
    {
      formData.append('departement',departement.id)
    }else{
      formData.append('departement',this.formPermanent.get('departement')?.value)
    }
    if(service && service.id)
    {
      formData.append('service',service.id)
    }else{
      formData.append('service',this.formPermanent.get('service')?.value)
    }
    if(agence_commercial && agence_commercial.id)
      {
        formData.append('agence_commercial',agence_commercial.id)
      }else{
        formData.append('agence_commercial',this.formPermanent.get('agence_commercial')?.value)
      }
    if(responsable && responsable.id)
    {
      formData.append('responsable',responsable.id)
    }
    if(this.image)
    {
      formData.append('photo',this.image,this.image?.name);
      this.upload="null"
    }else{
      formData.append('photo',this.imageUpdate);
      this.upload="upload";
    }
    formData.append('nom',this.formPermanent.get('nom')?.value);
    formData.append('prenom',this.formPermanent.get('prenom')?.value);
    formData.append('matricule',this.formPermanent.get('matricule')?.value);
    formData.append('email',this.formPermanent.get('email')?.value);
    formData.append('contrat',this.formPermanent.get('contrat')?.value);
    formData.append('adresse',this.formPermanent.get('adresse')?.value);
    formData.append('telephone',this.formPermanent.get('telephone')?.value.trim().replace(/\s/g,''));
    formData.append('telephone_pro',this.formPermanent.get('telephone_pro')?.value.trim().replace(/\s/g,''));
    formData.append('date_debut_contrat',this.formPermanent.get('date_debut_contrat')?.value)
    formData.append('date_fin_contrat',this.formPermanent.get('date_fin_contrat')?.value)
    if(this.formPermanent.get('DA')?.value)
    {
      formData.append('DA',this.formPermanent.get('DA')?.value.trim().replace(/\s/g,''));
    }
    if(statut.libelle.toLowerCase() =="Interimaire".toLowerCase())
    {
      formData.append('DA_kangourou',this.formPermanent.get('DA_kangourou')?.value.trim().replace(/\s/g,''))
      formData.append('duree_kangourou',this.formPermanent.get('duree_kangourou')?.value.trim().replace(/\s/g,''))
      formData.append('montant_kangourou',this.formPermanent.get('montant_kangourou')?.value.trim().replace(/\s/g,''))
      formData.append('temps_presence_autre_structure_sonatel',this.formPermanent.get('temps_presence_autre_structure_sonatel')?.value)
      formData.append('interimaireCategorie',this.formPermanent.get('interimaireCategorie')?.value)
      formData.append('cout_unitaire',this.formPermanent.get('cout_unitaire')?.value.trim().replace(/\s/g,''))
    }
    let categInterim = this.formPermanent.get('categorieInterim')?.value;
    if(categInterim!=null)
    {
      formData.append('categorieInterim',this.formPermanent.get('categorieInterim')?.value.id)
    }
    this.service.store(formData,this.idInterim,this.idProfile,this.upload,this.contrat_id,this.remplacer_id).subscribe({
      next:(response=>{
        if(response.statut===200)
          {  
            this.message = response.message;
          setTimeout(()=>{
            this.message =""
          },2000)
          this.formPermanent.reset();
          this.formPermanent.get('photo')?.setValue(this.userOne);
          this.responsable =false;
        }
        else if(response.statut === 221)
        {
          this.visible = true
          this.messageInfo = response.message;
          setTimeout(()=>{
            this.visible = false
            this.messageInfo =""
          },10000)
          console.log(response);
          
        }else{
          this.visible = true
          this.messageAttention = response.message;
          setTimeout(()=>{
            this.visible = false
            this.messageAttention =""
          },10000)
          console.log(response); 
        }
      }),error:(error=>{
        this.visible = true
        this.messageError = error.error.message;
        setTimeout(()=>{
          this.messageError = "";
          this.visible = false
        },10000)
        console.log(error);
      })
    })
  }
}
