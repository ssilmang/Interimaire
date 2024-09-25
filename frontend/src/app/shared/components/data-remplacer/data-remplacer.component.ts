import { AfterViewInit, Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataPermanentList, Permanent, Responsable } from 'src/app/_core/interface/permanent';
import { PermanentService } from 'src/app/_core/services/permanent.service';
import { environment } from 'src/environments/environment.development';
import { ModalComponent } from '../modal/modal.component';
import { AlertComponent } from '../alert/alert.component';
import {MatListModule} from'@angular/material/list';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/localStorage.service';
import { Router } from '@angular/router';
import { DataRemplacer } from 'src/app/_core/interface/interim';
@Component({
  selector: 'app-data-remplacer',
  standalone: true,
  imports: [
    ModalComponent,
    AlertComponent,
    MatListModule,
    CdkTableModule,
    CdkDropList,
    CdkDrag,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './data-remplacer.component.html',
  styleUrl: './data-remplacer.component.css'
})
export class DataRemplacerComponent implements AfterViewInit, OnInit{
  dataPermanents:Permanent[]=[];
  apiImag :string = environment.apiImg;
  show:boolean=false;
  formeValide = true;
  permanentData!:Permanent;
  selectedElement:string ="";
  dataResponsable : Permanent[] = [];
  displayedColumns:string[] =['prenom','nom','matricule','action'];
  displayedColumn: string[] = ['Prenom', 'Nom', 'Action', 'Prénom', 'nom'];
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  selection: any[] = [];
  permanentChange?:Permanent
  route=inject(Router);
  canal:string = "";
  categorie:string = "";
  libelle:string = "";
  change:string = "remplacer";
  changed:boolean=true;
  showModal:boolean = false;
  isCommentaire:boolean = false;
  annuler:boolean = true;
  couleur:string = "bg-white";
  footer:boolean = false;
  dataPermanentList:DataPermanentList<Permanent>[] = [];
  dataDetails?:Permanent;
  isDropdownOpen:boolean = true;
  faireCommentaire:boolean = true;
  hideSelectionIndicator = signal(false);
  @ViewChild('table', {static: true}) table!: MatTable<DataRemplacer<Permanent>>;
  constructor(private service : PermanentService, private crefDestroy :DestroyRef, private shared:LocalStorageService){

  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void
  {
    this.index()
    this.getSubstitution();
    this.getListRemplacement();
  }
  index()
  {
    this.service.getPermanent().pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(data=>{
        this.dataResponsable = data.data;
      })
    })
  }
  selectRow(element: Permanent)
  {
    this.formeValide = false;
    this.permanentData = element;
  }
  substitution=(element:Permanent)=>{
    this.show = true;
    this.permanentChange = element;
  }
  getSubstitution()
  {
    this.service.getSubstitution().pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response=>{
        this.dataPermanents = response.data.dataPermanent;
      })
    })
  }
  afficherDetails(permanent:Permanent){
    this.dataDetails = permanent;
    this.showModal = !this.showModal;
    this.faireCommentaire = true
    console.log(permanent);
    
  }
  selectOther=()=>{
    this.formeValide = false;
  }
  onModalCloseHandler=(event:boolean)=>{
    this.showModal = event;
  }
  clickCommentaire(event:string){

  }
  valider(event:string)
  {
    if(event === "Valider")
    {
      if(this.permanentData)
      {
        if(this.permanentChange?.id === this.permanentData.responsable.id)
        {
            this.permanentData.responsable = this.permanentChange.responsable;
        }
        this.shared.changeInterim(this.permanentData);
      }
      this.shared.clickIci('Remplacer');
      this.shared.changePermanent(this.permanentChange)
      this.route.navigateByUrl('/admin/elements/forms');
    }
  }
  close(event:boolean)
  {
    this.show = !this.show;
  }
  getListRemplacement=()=>
  {
    this.service.getListPermanent().pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response=>{
        console.log(response);
        this.dataPermanentList = response.data;
      })
    })
  }
  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataPermanentList.findIndex(d => d === event.item.data);

    moveItemInArray(this.dataPermanentList, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
  remplace=(event:Event)=>{
    let select = (event.target as HTMLSelectElement).value;
    this.change = select;
  }
  getUserInitials(prenom:string,nom:string):string {
    if (!prenom || !nom) return '';
    const initials = prenom.charAt(0).toUpperCase() + nom.charAt(0).toUpperCase();
    return initials;
  }
  toggleSelectionIndicator() {
    this.hideSelectionIndicator.update(value => !value);
  }
  toggleDropdown()
  {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
