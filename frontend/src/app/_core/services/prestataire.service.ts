import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestUser, Response, User, dataUser,UserToken } from '../interface/interim';
import { DataALL, DataPrestataire, Permanent, RequestSupprimer } from '../interface/permanent';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  _http=inject(HttpClient)
  constructor() { }
  isPrestataire(taille:number,page:number):Observable<Response<DataPrestataire>>
  {
    return this._http.get<Response<DataPrestataire>>(`${environment.apiUrl}index/prestataire/${taille}?page=${page}`)
  }
  registrer(data:RequestUser):Observable<Response<User>>
  {
    return this._http.post<Response<User>>(`http://127.0.0.1:8000/api/user`,data);
  }
  login(data:dataUser):Observable<Response<UserToken>>
  {
    return this._http.post<Response<UserToken>>(`http://127.0.0.1:8000/api/login`,data)
  }
  supprimerPersonne(data:RequestSupprimer,id:number):Observable<Response<Permanent>>
  {
    return this._http.post<Response<Permanent>>(`${environment.apiUrl}supprimer/${id}`,data);
  }
  indexAll():Observable<Response<DataALL>>
  {
    return this._http.get<Response<DataALL>>(`${environment.apiUrl}index/statuts`)
  }
}
