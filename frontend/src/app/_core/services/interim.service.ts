import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataInterim, Interim, RequestRompre, Response } from '../interface/interim';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Profile } from '../interface/permanent';

@Injectable({
  providedIn: 'root'
})
export class InterimService {

  constructor(private _http:HttpClient) { }
  index(taille:number,page:number):Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}interimaires/${taille}?page=${page}`);
  }
  isCommentaire(data:{commentaire:string},id:number):Observable<Response<Profile>>
  {
    return this._http.put<Response<Profile>>(`${environment.apiUrl}profile/commentaire/${id}`,data);
  }
  contratRompre(data:RequestRompre,id:number):Observable<Response<Interim>>
  {
    return this._http.put<Response<Interim>>(`${environment.apiUrl}contratRompre/${id}`,data);
  }
  finContrat(taille:number,page:number):Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}interim/finContrat/${taille}?page=${page}`);
  }
  processusKangourou(taille:number,page:number):Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}processusKangourou/${taille}?page=${page}`);
  }
}
