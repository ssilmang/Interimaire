import {Injectable, OnInit} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PermanentService } from "src/app/_core/services/permanent.service";

@Injectable({providedIn: "root"})

export class LocalStorageService implements OnInit{
  constructor() { }
  private interimSource = new BehaviorSubject<any>(null);
  currentInterim = this.interimSource.asObservable();
  private interimAgence = new BehaviorSubject<any>(null);
  currentAgence = this.interimAgence.asObservable();
  private Logout = new BehaviorSubject<any>(null);
  currentLogout = this.Logout.asObservable();
  ngOnInit(): void {
    
  }
  put(key:string, value: any){
    localStorage.setItem(key, value);
  }

  get(key: string):any{
    return localStorage.getItem(key);
  }

  remove(key: string){
    localStorage.removeItem(key);
  }

  destroy(){
    localStorage.clear();
  }
  changeInterim(interim: any) {
    this.interimSource.next(interim);
  }
  allAgence(data:any) {  
    this.interimAgence.next(data);
  }
  chargeLogout(event:any)
  {  
    this.Logout.next(event); 
  }
}
