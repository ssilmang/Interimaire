import {Injectable, OnInit} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { InterimService } from "src/app/_core/services/interim.service";
import { PermanentService } from "src/app/_core/services/permanent.service";

@Injectable({providedIn: "root"})

export class LocalStorageService implements OnInit{
  constructor(private service:InterimService,private serviceShared: PermanentService) { }
  private interimSource = new BehaviorSubject<any>(null);
  currentInterim = this.interimSource.asObservable();
  private interimAgence = new BehaviorSubject<any>(null);
  currentAgence = this.interimAgence.asObservable();
  private Logout = new BehaviorSubject<any>(null);
  currentLogout = this.Logout.asObservable();
  private Export = new BehaviorSubject<any>(null)
  currentExport = this.Export.asObservable();
  private openModal = new Subject<string>();
  openModal$ = this.openModal.asObservable();
  private paginate = new BehaviorSubject<any>(null);
  currentPaginate = this.paginate.asObservable();
  private openChange = new BehaviorSubject<any>(null);
  currentChange = this.openChange.asObservable();
  private openTheme = new BehaviorSubject<boolean>(false);
  currentTheme = this.openTheme.asObservable();
  ngOnInit(): void 
  {
  }
  put(key:string, value: any)
  {
    localStorage.setItem(key, value);
  }
  get(key: string):any
  {
    return localStorage.getItem(key);
  }
  remove(key: string){
    localStorage.removeItem(key);
  }
  destroy()
  {
    localStorage.clear();
  }
  changeInterim(interim: any)
  {
    this.interimSource.next(interim);
  }
  allAgence(data:any)
  {  
    this.interimAgence.next(data);
  }
  chargeLogout(event:any)
  {  
    this.Logout.next(event); 
  }
  chargerExport(permanent:string,prestataire:string,interim:string)
  {
     this.service.export(permanent,prestataire,interim).subscribe({
      next:(response:Blob)=>{
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gestion_rh.xlsx';
        if(permanent=='null' && interim==="null")
        {
          a.download = 'prestataires.xlsx';
        }
        if(prestataire==='null' && interim === "null")
        {
          a.download = 'permanents.xlsx';
        }
        if(permanent==='null' && prestataire ==='null')
        {
          a.download = 'interims.xlsx';
        }
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('File downloaded successfully');
        
      }, error: (err) => {
        console.error('Error downloading the file', err);
      }
     });
  }
  clickIci(value:string)
  {
    this.openModal.next(value);
  }
  chargePaginate(value:any)
  {
    this.paginate.next(value);
  }
  changePermanent(event:any){
    this.openChange.next(event)
  }
  theme=(event:boolean)=>{
    this.openTheme.next(event)
  }
}

