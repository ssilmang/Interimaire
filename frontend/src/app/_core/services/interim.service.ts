import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataInterim, Response } from '../interface/interim';
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
    return this._http.put<Response<Profile>>(`${environment.apiUrl}profile/commentaire/${id}`,data)
  }
}
