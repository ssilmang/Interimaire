import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response,DataReporting, DataRang } from '../interface/interim';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private _http:HttpClient) { }
  reporting():Observable<Response<DataReporting>>
  {
    return this._http.get<Response<DataReporting>>(`${environment.apiUrl}reporting`)
  }
  getAgence():Observable<Response<any>>{
    return this._http.get<Response<any>>(`${environment.apiUrl}getAgence`);
  }
  getCanal():Observable<Response<DataRang>>
  {
    return this._http.get<Response<DataRang>>(`${environment.apiUrl}getCanal`);
  }
  getCategorieGroupe():Observable<Response<any>>
  {
    return this._http.get<Response<any>>(`${environment.apiUrl}getCategorieGroupe`);
  }
}
