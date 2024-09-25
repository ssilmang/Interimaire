import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { DataInterim, DataRemplacer, Response } from '../interface/interim';
import { DataALL, DataPermanent, DataPermanentList, Permanent, RemplacerPermanent, RequestPermanent, RequestSupprimer, ResponsePermanent } from '../interface/permanent';

@Injectable({
  providedIn: 'root'
})
export class PermanentService {

  constructor( private _http:HttpClient) {

  }
  indexPermanents(id:string|null,index:number,page:number):Observable<Response<DataPermanent>>
  {
    return this._http.get<Response<DataPermanent>>(`${environment.apiUrl}index/permanents/${id}/${index}?page=${page}`)
  }
  indexAll():Observable<Response<DataALL>>
  {
    return this._http.get<Response<DataALL>>(`${environment.apiUrl}index/statuts`)
  }
  store(data:FormData,id?:number,idProfile?:number,upload?:string,contrat_id?:number,remplcer?:number):Observable<Response<RequestPermanent>>
  {
    return this._http.post<Response<RequestPermanent>>(`${environment.apiUrl}permanent/${id}/${idProfile}/${upload}/${contrat_id}/${remplcer}`,data)
  }
  importer(data:any):Observable<Response<any>>
  {
    return this._http.post<Response<any>>(`${environment.apiUrl}import/employeur`,data)
  }
  supprimerPersonne(data:RequestSupprimer,id:number):Observable<Response<Permanent>>
  {
    return this._http.post<Response<Permanent>>(`${environment.apiUrl}supprimer/${id}`,data);
  }
  getSubstitution():Observable<Response<RemplacerPermanent>>
  {
    return this._http.get<Response<RemplacerPermanent>>(`${environment.apiUrl}getSubstitution`);
  }
  getPermanent():Observable<Response<Permanent[]>>
  {
    return this._http.get<Response<Permanent[]>>(`${environment.apiUrl}getpermanent`);
  }
  getListPermanent():Observable<Response<DataPermanentList<Permanent>[]>>
  {
    return this._http.get<Response<DataPermanentList<Permanent>[]>>(`${environment.apiUrl}getListRemplacer`);
  }
}
