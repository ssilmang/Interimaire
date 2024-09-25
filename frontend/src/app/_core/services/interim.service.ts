import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataInterim, DataRemplacer, Interim, RequestRompre, Response } from '../interface/interim';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DataALL, Profile, RequestPermanent } from '../interface/permanent';

@Injectable({
  providedIn: 'root'
})
export class InterimService {

  constructor(private _http:HttpClient) { }
  index(taille:number,page:number):Observable<Response<DataInterim<Interim>>>
  {
    return this._http.get<Response<DataInterim<Interim>>>(`${environment.apiUrl}interimaires/${taille}?page=${page}`);
  }
  isCommentaire(data:{commentaire:string},id:number):Observable<Response<Profile>>
  {
    return this._http.put<Response<Profile>>(`${environment.apiUrl}profile/commentaire/${id}`,data);
  }
  contratRompre(data:RequestRompre,id:number):Observable<Response<Interim>>
  {
    return this._http.put<Response<Interim>>(`${environment.apiUrl}contratRompre/${id}`,data);
  }
  finContrat(taille:number,page:number):Observable<Response<DataInterim<Interim>>>
  {
    return this._http.get<Response<DataInterim<Interim>>>(`${environment.apiUrl}interim/finContrat/${taille}?page=${page}`);
  }
  processusKangourou(taille:number,page:number):Observable<Response<DataInterim<Interim>>>
  {
    return this._http.get<Response<DataInterim<Interim>>>(`${environment.apiUrl}processusKangourou/${taille}?page=${page}`);
  }
  export(permanent:string,prestataire:string,interim:string): Observable<Blob>
  {
    return this._http.get(`${environment.apiUrl}export/${permanent}/${prestataire}/${interim}`,{ responseType: 'blob' });
  }
  remplacer(data:FormData,user:number):Observable<Response<RequestPermanent>>
  {
    return this._http.post<Response<RequestPermanent>>(`${environment.apiUrl}interim/remplacer/${user}`,data)
  }
  indexRemplacer():Observable<Response<DataRemplacer<Interim>[]>>
  {
    return this._http.get<Response<DataRemplacer<Interim>[]>>(`${environment.apiUrl}remplacements`);
  }
  indexAll():Observable<Response<DataALL>>
  {
    return this._http.get<Response<DataALL>>(`${environment.apiUrl}index/statuts`)
  }
}
