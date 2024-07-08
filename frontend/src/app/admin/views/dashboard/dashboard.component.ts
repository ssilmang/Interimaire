import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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

  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [pageTransition]
})
export class DashboardComponent implements OnInit, AfterViewInit {
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
  couleur:string = "bg-red-600  hover:bg-red-700"
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
  public pages: number[] = TableData.pageNumber;
  constructor(private sharedService: LocalStorageService,private serve:PermanentService, private router: Router,private service:InterimService,private cdRef: ChangeDetectorRef){
    this.modalCompnent = new ModalComponent();
    this.formRompre = this.fb.group({
      date:[,[Validators.required,this.DateValidator(this.interimaire!)]],
      motif:[,[Validators.required]],
      date_debut:['',[Validators.required,this.DateDebutValidator]],
      date_fin:['',[Validators.required,this.DateFinValidator()]]
    })
  }
  ngOnInit(): void {
    this.cdRef.detectChanges();
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
    if(this.activeFinContrat){
     
      this.finContrat();
    }
    if(this.activeKangourou){
      this.Kangourou();
     
    }
    this.index();
    this.allAgence()
  }
  ngAfterViewInit(): void {
  }
  

  DateValidator(interimaire: Interim): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;    
      if (value && this.interimaire) {
        console.log(interimaire);
        
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
  DateDebutValidator(control: AbstractControl): { [key: string]: boolean} | null {
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
  DateFinValidator():ValidatorFn {
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
  index()
  {
    this.service.index().subscribe({
      next:(response=>{
        console.log(response);
        this.backg = "bg-orange-600"
        this.dataInterims = response.data.interimaires;
        this.activeFinContrat="";
        this.activeKangourou="";
        this.activeCours = "border-y-4 border-b-orange-600"

      })
    })
  }
  allAgence(){
    this.serve.indexAll().subscribe({
      next:(response=>{
        console.log(response);
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
    console.log("rompre");
    this.showModalRompre =!this.showModalRompre;
    this.interimaire = interim;
    this.id = interim.id;
    this.messageContrat =" rompre"
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
              if (this.interimaire) {
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
    if(event =="valider"){
      let data :FormData = new FormData();
      data.append('date',this.formRompre.get('date')?.value);
      data.append('motif',this.formRompre.get('motif')?.value);
      data.append('date_debut',this.formRompre.get('date_debut')?.value);
      data.append('date_fin',this.formRompre.get('date_fin')?.value);
      this.service.contratRompre(this.formRompre.value,this.id).subscribe({
        next:(response=>{
          console.log(response);
          if(response.statut==200){
            const index = this.dataInterims.findIndex(ele => ele.id === this.id);
            if (index !== -1) {
              console.log(index);
              
              this.dataInterims[index].date = this.formRompre.value.date;
              this.dataInterims[index].motif = this.formRompre.value.motif;
              this.dataInterims[index].etat = response.data.etat;
              console.log(response.data.etat);
              console.log(this.dataInterims);
              
            } 
            this.message  = response.message
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
    console.log(interim);
    this.messageContrat = " renouveler "
    this.showModalRompre =!this.showModalRompre;
    this.interimaire = interim;
    this.id = interim.id
    this.renouvelerContrat = true

  }
  editer(interim:Interim){
    console.log(interim);
    this.sharedService.changeInterim(interim);
    this.sharedService.allAgence(this.dataAgence);
    this.router.navigateByUrl('/admin/elements/forms')
  }
  finContrat()
  {
    this.service.finContrat().subscribe({
      next:(response)=>{
        console.log(response);
        this.activeFinContrat ="border-b-violet-700 border-y-4";
        this.backg = "bg-violet-700"
        this.activeCours="";
        this.activeKangourou="";
        this.dataInterims =response.data.interimaires
      }
    })
  }
  contratCours()
  {
   
    this.index();
  }
  Kangourou(){
    this.service.processusKangourou().subscribe({
      next:(response)=>{
        console.log(response);
        this.activeKangourou = "border-y-4 border-b-cyan-700";
        this.backg = "bg-cyan-700"
        this.activeCours="";
        this.activeFinContrat="";   
        this.dataInterims = response.data.interimaires;
      }
    })

  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen);
  }
}
