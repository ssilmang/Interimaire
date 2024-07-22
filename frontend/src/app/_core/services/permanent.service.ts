import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Response } from '../interface/interim';
import { DataALL, Permanent, RequestPermanent, ResponsePermanent } from '../interface/permanent';

@Injectable({
  providedIn: 'root'
})
export class PermanentService {

  constructor( private _http:HttpClient) {

  }
  indexPermanents(id:string|null):Observable<Response<Permanent>>
  {
    return this._http.get<Response<Permanent>>(`${environment.apiUrl}index/permanents/${id}`)
  }
  indexAll():Observable<Response<DataALL>>
  {
    return this._http.get<Response<DataALL>>(`${environment.apiUrl}index/statuts`)
  }
  store(data:FormData,id?:number,idProfile?:number,upload?:string,contrat_id?:number):Observable<Response<RequestPermanent>>
  {
    return this._http.post<Response<RequestPermanent>>(`${environment.apiUrl}permanent/${id}/${idProfile}/${upload}/${contrat_id}`,data)
  }
  importer(data:any):Observable<Response<any>>
  {
    return this._http.post<Response<any>>(`${environment.apiUrl}import/employeur`,data)
  }
}
