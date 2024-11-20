import { cart } from './../models/cart';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart_url = "https://fakestoreapi.com/carts"

  constructor(private httpClient:HttpClient) { }

  getCartProducts():Observable<cart[]>{
    return this.httpClient.get<cart[]>(this.cart_url).pipe(
      catchError((error:HttpErrorResponse)=>{
        return throwError(()=>error)
      })
    )
  }


}
