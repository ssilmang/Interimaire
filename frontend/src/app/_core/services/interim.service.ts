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
  index():Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}interimaires`);
  }
  isCommentaire(data:{commentaire:string},id:number):Observable<Response<Profile>>
  {
    return this._http.put<Response<Profile>>(`${environment.apiUrl}profile/commentaire/${id}`,data);
  }
  contratRompre(data:RequestRompre,id:number):Observable<Response<Interim>>
  {
    return this._http.put<Response<Interim>>(`${environment.apiUrl}contratRompre/${id}`,data);
  }
  finContrat():Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}interim/finContrat`);
  }
  processusKangourou():Observable<Response<DataInterim>>
  {
    return this._http.get<Response<DataInterim>>(`${environment.apiUrl}processusKangourou`);
  }
}
