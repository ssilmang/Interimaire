import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Response } from '../interface/interim';
import { ResponsePermanent } from '../interface/permanent';

@Injectable({
  providedIn: 'root'
})
export class PermanentService {

  constructor( private _http:HttpClient) {

  }
  indexPermanents():Observable<Response<ResponsePermanent>>
  {
    return this._http.get<Response<ResponsePermanent>>(`${environment.apiUrl}dv`)
  }
}
