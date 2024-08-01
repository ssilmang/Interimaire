import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Images } from 'docs/assets/data/images';
import { Agence, Interim, RequestRompre } from 'src/app/_core/interface/interim';
import { InterimService } from 'src/app/_core/services/interim.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { pageTransition } from 'src/app/shared/utils/animations';
import { environment } from 'src/environments/environment.development';

import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { Router, RouterModule } from '@angular/router';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { TableData } from '../elements/data-table/table.data';
import * as  XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import {Dialog,DialogModule,DialogRef} from '@angular/cdk/dialog';
import { DialogExprtComponent } from '../dialog/dialog-exprt/dialog-exprt.component';
import { RechercherLibellePipe } from '../../pipe/rechercher-libelle.pipe';
import { MatDialog } from '@angular/material/dialog';
import { DiolagRemplacementComponent } from '../dialog/diolag-remplacement/diolag-remplacement.component';
// import { ExcelService } from 'src/app/excel-service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    AlertComponent,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatInputModule,
    DialogModule,
    RechercherLibellePipe,
    
    
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [pageTransition]
})
export class DashboardComponent implements OnInit, AfterViewInit
{
  myControl = new FormControl('');
  options: string[] = ['3','6','8','10','20','30','40','50','60','70','80','90','100'];
  filteredOptions!: Observable<string[]>;
  eventDate: any = formatDate(new Date(), 'MMM dd, yyyy', 'en');
  dataInterims:Interim[]=[]
  showModal: boolean = false;
  interimaire?:Interim 
  modalCompnent: ModalComponent;
  public userOne: string = Images.users.userOne;
  public dataInterim?:Interim
  apiImag=environment.apiInterim;
  shorting: boolean = false;
  faireCommentaire:boolean = true;
  isCommentaire:boolean = false
  couleur:string = "bg-red-600  hover:bg-red-700";
  formeValide:boolean=true
  commentaire:string = "";
  annuler: boolean = true;
  showModalRompre: boolean = false;
  romp:boolean = true;
  showRompre:boolean = false;
  not:boolean = true;
  couleurRompre:string = "bg-green-700  hover:bg-green-800"
  date:string="";
  motif:string="";
  id:number =0;
  message:string=""
  renouvelerContrat:boolean = false;
  date_debut:string = "";
  date_fin:string = "";
  messageContrat:string = "";
  formRompre:FormGroup
  fb=inject(FormBuilder);
  activeFinContrat:string = ""
  activeCours:string="";
  activeKangourou:string="";
  dataAgence:Agence[]=[];
  isDropdownOpen:boolean=true;
  kangourouInterim:Interim[]=[];
  backg:string = "";
  currentPage:number=0;
  total:number=0;
  taille:number=3;
  formRenouveler:FormGroup
  footer: boolean = true;
  hiddern: string='hidden';
  messageExport: string="";
  event:string="";
  libelle:string=''
  remplacement:string=''
  constructor(
    private sharedService: LocalStorageService,
    private serve:PermanentService, 
    private router: Router,
    private service:InterimService,
    private cdRef: ChangeDetectorRef,
    public dialog:Dialog,
    public dialogg:MatDialog,
    // private excelService:ExcelService
  )
  {
    this.modalCompnent = new ModalComponent();
    this.formRompre = this.fb.group(
    {
      date:[,[Validators.required,this.DateValidator(this.interimaire!)]],
      motif:[''],
      date_debu:[''],
      date_fin:['']
    });
    this.formRenouveler = this.fb.group({
      date_debut:['',[Validators.required,this.DateDebutValidator]],
      date_fin:['',[Validators.required,this.DateFinValidator()]]
    })
    this.formRompre.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
    this.formRenouveler.valueChanges.subscribe(()=>{
      this.checkform()
    })
  }
  ngOnInit(): void 
  {
    this.myControl.setValue('3');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.sharedService.openModal$.subscribe(event=>{
      this.hiddern='block'
      this.event = event;
      if(event){
        if(event==='encours'){
           this.messageExport="Vous voulez exporter les interimaires en cours"
        }else{
           this.messageExport="Vous voulez exporter tous les interimaires "
        }
        this.cdRef.detectChanges();
      }
    })
    
   
    // var myChart = new Chart("areaWiseSale", {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //       ],
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       x: {
    //         display: false
    //       },
    //       y: {
    //         display: false
    //       },
    //     },
    //     plugins: {
    //       legend: {
    //         position: 'right',
    //         align: 'center',
    //       },
    //     },
    //   },
    // });
    this.index(this.taille,this.currentPage);
    this.allAgence();
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options;
  }
  ngAfterViewInit=(): void=>
  {    

    if(this.activeFinContrat)
    { 
      this.finContrat();
    }
    if(this.activeKangourou)
    {  
      this.Kangourou();
    }
    console.log(this.sharedService.openModal$);
    
    
  }
  checkFormValidity() {
    if (this.formRompre.valid) {
      this.formeValide = false; 
    } else {
      this.formeValide = true; 
    }
  }
  checkform(){
    if(this.formRenouveler.valid){
      this.formeValide = false;
    }
  }
  DateValidator(interimaire: Interim): ValidatorFn
 {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;    
      if (value && this.interimaire) {       
        const dateValue = new Date(value);
        const dateDebutContrat = new Date(this.interimaire.contrats.date_debut_contrat!);
        const dateFinContrat = new Date(this.interimaire.contrats.date_fin_contrat);
        const dateActuel = new Date();
        if (dateValue <= dateDebutContrat || dateValue >= dateFinContrat) {  
          return { 'horsIntervale': true };
        }
        if(dateValue < dateActuel){
          return {'erreur':true}
        }
      }
      return null;
    };
  }
  DateDebutValidator(control: AbstractControl): { [key: string]: boolean} | null
 {
    const debut = new Date(control.value);
    const fin = new Date(control.parent?.get('date_fin')?.value);
    const dateActuel = new Date();
    if(debut < dateActuel ){
      return {'error':true};
    }
    dateActuel.setDate(dateActuel.getDate()+3);
    if(debut <dateActuel){
      return {'trois':true};
    }
    if (debut && fin) {
      if (debut >= fin ) {
        return { 'hors': true };
      }
    }
      return null;
  }
  DateFinValidator():ValidatorFn
  {
   return (control: AbstractControl): { [key: string]: boolean} | null=> {
      const fin = new Date(control.value);
      const debut = new Date(control.parent?.get('date_debut')?.value); 
      if (debut && fin && this.interimaire) {
        const contratAcheve = this.interimaire.contrats.temps_presence_autre_structure_sonatel + this.interimaire.contrats.duree_contrat;
        const diffMillisecondes = fin.getTime() - debut.getTime();
        const autreStructureEnAnnee = contratAcheve /12;
        const deuxAns = diffMillisecondes /(1000 * 60 * 60 * 24 *365.25) + autreStructureEnAnnee;
        if (debut >= fin ) {
          return { 'hors': true };
        }if( deuxAns >2){         
          return {'error':true}
        }
      }
      return null;
    }
  }
  index(taille:number,page:number)
  {
    this.service.index(taille,page).subscribe({
      next:(response=>{
        this.backg = "bg-orange-600"
        this.dataInterims = response.data.interimaires;
        this.currentPage = response.data.pagination.page;
        this.total = response.data.pagination.total;
        this.taille= response.data.pagination.taille;    
        this.activeFinContrat="";
        this.activeKangourou="";
        this.activeCours = "border-y-4 border-b-orange-600"
      })
    })
  }
  allAgence()
  {
    this.serve.indexAll().subscribe({
      next:(response=>{
        this.dataAgence = response.data.agences       
      })
    })
  }
  openModal(interim :Interim)
  {
    this.showModal = !this.showModal;
    this.interimaire = interim;   
  }
  onModalCloseHandler(event: boolean)
  {
    this.showModal = event;
    this.faireCommentaire = true
    this.annuler = true
    this.isCommentaire = false;
    this.couleur =  "bg-red-600  hover:bg-red-700"
  }
  sortingUp()
  {
    this.shorting = !this.shorting;
  }
  sortingDown()
  {
    this.shorting = !this.shorting;
  }
  rompre(interim:Interim)
  {
    this.showModalRompre =!this.showModalRompre;
    this.interimaire = interim;
    this.id = interim.id;
    this.messageContrat ="rompre"
  }
  clickCommentaire(event:string)
  {
    this.faireCommentaire = false;
    let string = "Enregistrer";   
    this.isCommentaire = true; 
    this.annuler = false;
    this.couleur= "bg-green-700  hover:bg-green-800"
    if(event.toLowerCase() === string.toLowerCase())
    {
        let idUser = this.interimaire?.profile.id;
        const data = {
          commentaire:this.commentaire
          };
        this.service.isCommentaire(data,idUser!).subscribe({
          next:(response=>{
            if(response.statut==200)
            {
              if (this.interimaire)
              {
                this.interimaire.profile = response.data;
              }
              this.annuler = true;
              this.showModal =false
              this.faireCommentaire = true
              this.isCommentaire = false;
               this.couleur= "bg-red-600  hover:bg-red-700"
            }
          })
        })
    }else{
      this.commentaire = this.interimaire?.profile.commentaire!
    }
  }
  openModalRompre(event :string) 
  {    
      this.showRompre = !this.showRompre;     
  }
  onModalCloseRompre(event:boolean) 
  {
    this.showModalRompre = false;
  }
  validerRompre(event:string)
  {
    if(event === "valider")
    {
      this.formRompre.get('date_debut')?.setValue(this.formRenouveler.get('date_debut')?.value)
      this.formRompre.get('date_fin')?.setValue(this.formRenouveler.get('date_fin')?.value)
      this.service.contratRompre(this.formRompre.value,this.id).subscribe({
        next:(response=>{
          if(response.statut==200)
          {
            const index = this.dataInterims.findIndex(ele => ele.id === this.id);
            if (index !== -1) 
            {                  
              this.dataInterims[index].date = this.formRompre.value.date;
              this.dataInterims[index].motif = this.formRompre.value.motif;
              this.dataInterims[index].etat = response.data.etat;           
            } 
            this.message  = response.message
            this.footer =false;
            setTimeout(()=>{
              this.message =""
              this.showModalRompre = false;
              this.showRompre = false
            },5000)
          }
        })
      })
    }
  }
  closeRompre(event:boolean)
  {

  }
  renouveler(interim:Interim)
  {
    this.messageContrat = "renouveler"
    this.showModalRompre =!this.showModalRompre;
    this.interimaire = interim;
    this.id = interim.id
    this.renouvelerContrat = true

  }
  editer(interim:Interim)
  {
    this.sharedService.changeInterim(interim);
    this.sharedService.allAgence(this.dataAgence);
    this.router.navigateByUrl('/admin/elements/forms')
  }
  finContrat=()=>
  {
    this.taille=3;
    this.currentPage =0
    this.service.finContrat(this.taille,this.currentPage).subscribe({
      next:(response)=>{
        this.activeFinContrat ="border-b-violet-700 border-y-4";
        this.backg = "bg-violet-700"
        this.activeCours="";
        this.activeKangourou="";
        this.remplacement=""
        this.dataInterims =response.data.interimaires
        this.currentPage = response.data.pagination.page;
        this.total = response.data.pagination.total;
        this.taille= response.data.pagination.taille;
      }
    })
  }
  contratCours=()=>
  {
    this.activeCours="contrat activé"
    this.activeKangourou="";
    this.remplacement=''
    this.activeFinContrat="";
    this.index(this.taille,this.currentPage);
  }
  Kangourou()
  {
    this.taille=3;
    this.currentPage =0
    this.service.processusKangourou(this.taille,this.currentPage).subscribe({
      next:(response)=>{
        this.activeKangourou = "border-y-4 border-b-cyan-700";
        this.backg = "bg-cyan-700"
        this.activeCours="";
        this.activeFinContrat="";  
        this.remplacement='' 
        this.dataInterims = response.data.interimaires;
        this.currentPage = response.data.pagination.page;
        this.total = response.data.pagination.total;
        this.taille= response.data.pagination.taille;
      }
    })
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  get totalPages(): number[] 
  {
    const pagesCount = Math.ceil(this.total / this.taille);
    return Array.from({ length: pagesCount }, (_, index) => index + 1);
  }
  PageTailleChange=(event: Event): void =>
  { 
    let nmbre =  Number((event.target as HTMLInputElement).value);
    this.option(nmbre);
  }
  optionSelected(event: any): void 
  {
    const selectedValue = event.option.value;
    this.myControl.setValue(selectedValue);
    this.option(this.myControl.value)
  }
  option(nmbre:any):void
  {
    if(!isNaN(nmbre)){
      if(nmbre <= this.total){
        this.taille =nmbre;
      }else{
        this.taille= this.total
        this.currentPage =0
      }
    }else{
      this.taille = this.total;
      this.currentPage=0
    }
    if(this.activeCours){
      this.index(this.taille,this.currentPage);
    }
    if(this.activeKangourou){
      this.Kangourou()
    }
    if(this.activeFinContrat){
      this.finContrat();
    }
  }
  prevPage=(): void=>
 {
    if (this.currentPage > 1)
   {
      this.currentPage--;
      if(this.activeCours){
        this.index(this.taille,this.currentPage);
      }
      if(this.activeKangourou){
        this.Kangourou()
      }
      if(this.activeFinContrat){
        this.finContrat();
      }
    }
  }
  nextPage=(): void=>
 {
    if (this.currentPage < this.totalPages.length)
    {
      this.currentPage++;
      if(this.activeCours){
        this.index(this.taille,this.currentPage);
      }
      if(this.activeKangourou){
        this.Kangourou()
      }
      if(this.activeFinContrat){
        this.finContrat();
      }
    }
  }
  selectPage=(page:number):void=>
  {
    this.currentPage=page;
    if(this.activeCours){
      this.index(this.taille,this.currentPage);
    }
    if(this.activeKangourou){
      this.Kangourou()
    }
    if(this.activeFinContrat){
      this.finContrat();
    }
  }
  export()
  {
    if(this.activeCours){
      this.dialog.open<string>(DialogExprtComponent);
    }else{
      this.hiddern = 'block';  
      if(this.activeFinContrat)
      { 
        this.messageExport = "Vous voulez exporter tous les interimaires qui sont en fin de contrat "
      }
      if(this.activeKangourou)
      {  
        this.messageExport = 'Vous voulez exporter tous les interimaires qui sont dans le processus de kangourou'
      }

    }
  }
  valider()
  {
    this.hiddern = 'hidden';
    if(this.activeFinContrat)
    { 
        this.exportContrat('Interim_fin_contrat')
    }
    if(this.activeKangourou)
    {  
       this.exportContrat('Interim_kangourou')
    }
    console.log(this.activeCours);
    
    if(this.activeCours){
      if(this.event==="encours"){
        this.exportContrat('Interim_contrat_enCours')
      }else{
        this.sharedService.chargerExport('null','null','interimaires');
      }
    }

  }
  close()
  {
    this.hiddern = 'hidden';
  }
  exportContrat(nomFichier:string)
  {   
    const data = this.dataInterims.map(interim=>({ 
          "Matricule":interim?.profile?.matricule?? 'N/A',
          'Prénom':interim?.profile?.prenom ?? 'N/A',
          'Nom':interim?.profile?.nom ?? 'N/A',
          'Poste':interim?.poste?.libelle ?? 'N/A',
          'Canal':interim?.responsable?.canal?.libelle ?? 'N/A',
          'Direction':interim?.responsable?.direction?.libelle??'N/A',
          'Pole':interim?.responsable?.pole?.libelle ?? 'N/A',
          'Departement':interim?.responsable?.departement?.libelle ?? 'N/A',
          'Service':interim?.responsable?.service?.libelle ?? 'N/A',
          'Lieu d\'exécution':interim?.locau.libelle??'N/A',
          'Responsable Hiérarchique':interim?.responsable?.profile?.prenom+' '+interim?.responsable?.profile?.nom ?? 'N/A',
          'Statut':interim?.statut?.libelle ?? 'N/A',
          'Agence interim':interim?.categorie?.agence?.libelle ?? 'N/A',
          'Groupe':'N/A',
          'Categorie':interim?.categorie?.libelle ?? 'N/A',
          'MOVEMENT : Avancement/Promotion':'N/A',
          'DATE DERNIER(E) : Avancement/Promotion':'N/A',
          'Téléphone':interim?.profile?.telephone ?? 'N/A',
          'Téléphone pro':interim?.profile?.telephone_pro ?? 'N/A',
          'Courriel':interim?.profile?.email ?? 'N/A',
          'Commentaire':interim?.profile?.commentaire ?? 'N/A',
          'DA':interim?.contrats?.DA ?? 'N/A',
          'Date début':interim?.contrats?.date_debut_contrat ?? 'N/A',
          'Date fin':interim?.contrats?.date_fin_contrat ?? 'N/A',
          'Temps présence structure actuelle':interim?.contrats?.temps_presence_structure_actuel ?? 'N/A',
          'Temps présence autres structures Sonatel':interim?.contrats?.temps_presence_autre_structure_sonatel ??'N/A',
          'Cumul temps de présence Sonatel':interim?.contrats?.cumul_presence_sonatel ?? 'N/A',
          'Durée kangourou':interim?.poste?.duree_kangurou ?? 'N/A',
          'Durée contrat':interim?.contrats?.duree_contrat ?? 'N/A',
          'Durée contrat restante':interim?.contrats?.duree_contrat_restant ?? 'N/A',
          'Coût unitaire (tarif journalier)':interim?.categorie?.cout_unitaire_journalier ?? 'N/A',
          'Coût mensuel (tarif mensuel)':interim?.contrats?.cout_mensuel ?? 'N/A',
          'DA kangourou':interim?.contrats?.DA_kangourou ?? 'N/A',
          'Montant kangourou':interim?.poste?.montant_kangurou ?? 'N/A',
          'Coût global':interim?.contrats?.cout_global ??'N/A',
          'Etat':interim?.etat,   
    }))
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
  
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    // Save to file
    XLSX.writeFile(wb, nomFichier+'.xlsx');
  }
//   exportContrat(nomFichier:string)
//   {   
//     const data = this.dataInterims.map(interim=>({ 
//           'Prenom':interim?.profile?.prenom ?? 'N/A',
//           'Nom':interim?.profile?.nom ?? 'N/A',
//           "Matricule":interim?.profile?.matricule?? 'N/A',
//           'Direction':interim?.responsable?.direction?.libelle??'N/A',
//           'Pole':interim?.responsable?.pole?.libelle ?? 'N/A',
//           'Departement':interim?.responsable?.departement?.libelle ?? 'N/A',
//           'Service':interim?.responsable?.service?.libelle ?? 'N/A',
//           'Lieu d\'execution':'N/A',
//           'Poste':interim?.poste?.libelle ?? 'N/A',
//           'Responsable Hierarchique':interim?.responsable?.profile?.prenom+' '+interim?.responsable?.profile?.nom ?? 'N/A',
//           'Canal':interim?.responsable?.canal?.libelle ?? 'N/A',
//           'Statut':interim?.statut?.libelle ?? 'N/A',
//           'Groupe':'N/A',
//           'Categorie':interim?.categorie?.libelle ?? 'N/A',
//           'Agence interim':interim?.categorie?.agence?.libelle ?? 'N/A',
//           'Telephone':interim?.profile?.telephone ?? 'N/A',
//           'Telephone pro':interim?.profile?.telephone_pro ?? 'N/A',
//           'Email':interim?.profile?.email ?? 'N/A',
//           'Commentaire':interim?.profile?.commentaire ?? 'N/A',
//           'DA':interim?.contrats?.DA ?? 'N/A',
//           'Date debut':interim?.contrats?.date_debut_contrat ?? 'N/A',
//           'Date fin':interim?.contrats?.date_fin_contrat ?? 'N/A',
//           'Temps presence structure actuelle':interim?.contrats?.temps_presence_structure_actuel ?? 'N/A',
//           'Temps presence autres structures sonatel':interim?.contrats?.temps_presence_autre_structure_sonatel ??'N/A',
//           'Cumul temps de presence sonatel':interim?.contrats?.cumul_presence_sonatel ?? 'N/A',
//           'Durée kangourou':interim?.poste?.duree_kangurou ?? 'N/A',
//           'Durée contrat':interim?.contrats?.duree_contrat ?? 'N/A',
//           'Durée contrat restante':interim?.contrats?.duree_contrat_restant ?? 'N/A',
//           'Coût unitaire(tarif journalier)':interim?.categorie?.cout_unitaire_journalier ?? 'N/A',
//           'Coût mensuel(tarif mensuel)':interim?.contrats?.cout_mensuel ?? 'N/A',
//           'DA kangourou':interim?.contrats?.DA_kangourou ?? 'N/A',
//           'Montant kangourou':interim?.poste?.montant_kangurou ?? 'N/A',
//           'Coût global':interim?.contrats?.cout_global ??'N/A',
//           'Etat':interim?.etat,   
//     }))
//     const  columns=['Prenom',
//           'Nom',
//           "Matricule",
//           'Direction',
//           'Pole',
//           'Departement',
//           'Service',
//           'Lieu d\'execution',
//           'Poste',
//           'Responsable Hierarchique',
//           'Canal',
//           'Statut',
//           'Groupe',
//           'Categorie',
//           'Agence interim',
//           'Telephone',
//           'Telephone pro',
//           'Email',
//           'Commentaire',
//           'DA',
//           'Date debut',
//           'Date fin',
//           'Temps presence structure actuelle',
//           'Temps presence autres structures sonatel',
//           'Cumul temps de presence sonatel',
//           'Durée kangourou',
//           'Durée contrat',
//           'Durée contrat restante',
//           'Coût unitaire(tarif journalier)',
//           'Coût mensuel(tarif mensuel)',
//           'DA kangourou',
//           'Montant kangourou',
//           'Coût global',
//           'Etat' ]
//   //  this.excelService.exportExcel('',data,columns,'','sales-report', 'Sheet1')
//   //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
//   //   for (let i  in ws) {
//   //     console.log(ws[i]);
//   //     if (typeof ws[i] != 'object') continue;
//   //     let cell = XLSX.utils.decode_cell(i);

//   //     ws[i].s = {
//   //       // styling for all cells
//   //       font: {
//   //         name: 'arial',
//   //       },
//   //       alignment: {
//   //         vertical: 'center',
//   //         horizontal: 'center',
//   //         wrapText: '1', // any truthy value here
//   //       },
//   //       border: {
//   //         right: {
//   //           style: 'thin',
//   //           color: '000000',
//   //         },
//   //         left: {
//   //           style: 'thin',
//   //           color: '000000',
//   //         },
//   //       },

//   //     };
//   //     console.log(cell.r);
      
//   //     if (cell.r == 0) {
//   //       // first row
//   //       ws[i].s.border.bottom = {
//   //         // bottom border
//   //         style: 'thin',
//   //         color: '000000',

//   //       };
//   //       ws[i].s={
//   //         fill : {
//   //         // background color
//   //         patternType: 'solid',
//   //         fgColor: { rgb: 'b2b2b2' },
//   //         bgColor: { rgb: 'b2b2b2' },
//   //       }
//   //     };
//   //       if (cell.r % 2) {
//   //         // every other row
//   //         ws[i].s.fill = {
//   //           // background color
//   //           patternType: 'solid',
//   //           fgColor: { rgb: 'b2b2b2' },
//   //           bgColor: { rgb: 'b2b2b2' },
//   //         };
//   //       }
//   //   }
     
//   //   // const range = XLSX.utils.decode_range(ws['!ref']!);
//   //   // for (let C = range.s.c; C <= range.e.c; ++C) {
//   //   //   const address = XLSX.utils.encode_cell({ c: C, r: 0 });
//   //   //   if (!ws[address]) continue;
//   //   //   ws[address].s = {
//   //   //     fill: {
//   //   //       fgColor: { rgb: "FFFF20" } // Background color
//   //   //     },
//   //   //     font: {
//   //   //       bold: true,
//   //   //       color: { rgb: "FF0000" }, // Text color
//   //   //     },
//   //   //     alignment: {
//   //   //       horizontal: 'center',
//   //   //       vertical: 'center'
//   //   //     }
//   //   //   };
//   //   // }
  
//   // }
//   //   const wb: XLSX.WorkBook =XLSX.utils.book_new();
//   //    XLSX.utils.book_append_sheet(wb,ws,'sheet1');
//   //   // Save to file
//   //   XLSX.writeFile(wb, nomFichier +'.xlsx');
// }
  remplacer=()=>{
      const dialogRef = this.dialogg.open(DiolagRemplacementComponent);
      dialogRef.afterClosed().subscribe(result=>{
        console.log(result);
      })
  }
  remplacerContrat=()=>{
    this.activeCours='';
    this.activeFinContrat='';
    this.activeKangourou=""
    this.remplacement='border-y-4 border-b-emerald-700'
  }
}
