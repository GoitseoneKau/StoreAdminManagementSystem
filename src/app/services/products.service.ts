import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { cart } from '../models/cart';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private url = "https://fakestoreapi.com/products"
  private oneProductSubject = new BehaviorSubject<any>(null)
  private productsBehaviorSubject =  new BehaviorSubject<Product[]>([])
  private products$ = this.productsBehaviorSubject.asObservable()
  private length=0

  

  constructor(private httpClient:HttpClient) { }


  fetchProduct$(){
    this.httpClient.get<Product[]>(this.url)
    .subscribe(
      (products)=>{
        this.length = products.length

        products.map((product)=>{
            product.title = product.title.toLowerCase()
            product.category = product.category.toLowerCase()
        })

        this.productsBehaviorSubject.next(products)
      }
    )
  }

  updateProduct$(data:Product[]){
    this.productsBehaviorSubject.next(data)
  }

  getProduct$(){
    return this.products$
  }
 
  getProductLength(){
    this.fetchProduct$()
    return this.length
  }

  getProduct(id:number):Observable<Product>{
    return this.httpClient.get<Product>(`${this.url}/${id}`)
  }

  getProducts():Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.url)
  }

  getProductCategories():Observable<string[]>{
    return this.httpClient.get<string[]>(`${this.url}/categories`)
  }

  postProduct(product:Product):Observable<Product>{
    return this.httpClient.post<Product>(this.url,product)
  }

  updateProduct(product:Product):Observable<Product>{
    return this.httpClient.put<Product>(`${this.url}/${product.id}`,product)
  }

  setUpdateBehavior(input:Product){
    this.oneProductSubject.next(input)
  }

  getUpdateProduct(){
    console.log(this.oneProductSubject.getValue())
    return this.oneProductSubject.asObservable()
  }

  deleteProduct(product:Product):Observable<Product>{
    return this.httpClient.delete<Product>(`${this.url}/${product.id}`)
  }


}


