import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = "https://fakestoreapi.com/auth/login"
  private readonly platformId = inject(PLATFORM_ID);

  private isLoggedinSubject = new BehaviorSubject<boolean>(false)//subject to store boolean

  constructor(private httpClient:HttpClient) { }  //inject httpclient in constructor



  login(username:string,password:string){
    
    return this.httpClient.post<string>(this.url,{username,password}).pipe(
      map(token=>{
        this.setUser({username,password,token})
        return this.getUser()
      }),
      catchError((error:HttpErrorResponse)=>{
        return throwError(()=>error)
      })
    )
   
  }


  getUser(){
    if(isPlatformBrowser(this.platformId)){ 
      let user = localStorage.getItem("user")
      return user?JSON.parse(user):null
    }
    return null
  }


  setUser(user:any){
    if(isPlatformBrowser(this.platformId)){ 
      localStorage.setItem("user",JSON.stringify(user))
    }
  }


  get currentUser():{username:string,password:string,token:string}{
    return this.getUser()
  }


  isLoggedIn(){
    if(isPlatformBrowser(this.platformId)){ 
      this.isLoggedinSubject.next(this.getUser() !== null)
    }
    return  this.isLoggedinSubject.asObservable()
  }


  logout(){
    if(isPlatformBrowser(this.platformId)){
      if(!this.isLoggedIn()){return} 
      localStorage.removeItem("user")
      this.isLoggedinSubject.next(false)
    }
  }

}
