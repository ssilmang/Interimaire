import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response,DataReporting, DataRang,DepartementDatas,DataArchive } from '../interface/interim';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private _http:HttpClient) { }
  annee_mois():Observable<Response<any>>
  {
    return this._http.get<Response<any>>(`${environment.apiUrl}get/annee_mois`);
  }
  reporting():Observable<Response<DataReporting>>
  {
    return this._http.get<Response<DataReporting>>(`${environment.apiUrl}reporting`)
  }
  getAgence():Observable<Response<any>>{
    return this._http.get<Response<any>>(`${environment.apiUrl}getAgence`);
  }
  getDepartement():Observable<Response<any>>
  {
    return this._http.get<Response<DepartementDatas>>(`${environment.apiUrl}getdrv/support`);
  }
  getCanal():Observable<Response<DataRang>>
  {
    return this._http.get<Response<DataRang>>(`${environment.apiUrl}getCanal`);
  }
  getCategorieGroupe():Observable<Response<any>>
  {
    return this._http.get<Response<any>>(`${environment.apiUrl}getCategorieGroupe`);
  }
  archiveReporting(data:any,annee:string,mois:string):Observable<Response<any>>
  {
    return this._http.post<Response<any>>(`${environment.apiUrl}dataReporting/${annee}/${mois}`,data);
  }
  searchArchive(annee:string,mois:number):Observable<Response<DataArchive>>
  {
    return this._http.get<Response<DataArchive>>(`${environment.apiUrl}getArchiveReporting/${annee}/${mois}`)
  }
}
