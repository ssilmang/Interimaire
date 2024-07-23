import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { product } from "../interface/products";
import { saledata } from "../interface/salesdata";

@Injectable({
    providedIn:'root'
})
export class MasterService{
    constructor(private _http:HttpClient){

    }
    loadProducts(){
        return this._http.get<product[]>('http://localhost:3000/products');
    }
    loadSalesData(){
        return this._http.get<saledata[]>('http://localhost:3000/sales');
    }
}