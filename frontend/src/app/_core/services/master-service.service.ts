import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { product } from '../interface/products';
import { saledata } from '../interface/salesdata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {

  constructor(private _http:HttpClient) { }
  loadProducts(){
    return this._http.get<product[]>("http://localhost:3000/products");
}
loadSalesData()
{
    const data = this._http.get<any>("http://localhost:8000/api/data");
    console.log(data);
    return data;
    
}
}
