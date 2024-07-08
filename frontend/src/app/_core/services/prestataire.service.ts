import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestUser, Response, User, dataUser,UserToken } from '../interface/interim';
import { Permanent } from '../interface/permanent';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  _http=inject(HttpClient)
  constructor() { }
  isPrestataire():Observable<Response<Permanent[]>>
  {
    return this._http.get<Response<Permanent[]>>(`${environment.apiUrl}index/prestataire`)
  }
  registrer(data:RequestUser):Observable<Response<User>>
  {
    return this._http.post<Response<User>>(`http://127.0.0.1:8000/api/user`,data);
  }
  login(data:dataUser):Observable<Response<UserToken>>
  {
    return this._http.post<Response<UserToken>>(`http://127.0.0.1:8000/api/login`,data)
  }
}
