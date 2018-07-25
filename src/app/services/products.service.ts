import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/productList');

  }

  insertMasterData(product: Product): Observable<any> {
    
    return this.http.get('');

   } 
  
  public login(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.url + '/showproducts');

  }

}
