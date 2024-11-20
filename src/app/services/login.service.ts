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
  private currentUserSubject = new BehaviorSubject<any>(this.getUser())
  private isLoggedinSubject = new BehaviorSubject<boolean>(false)

  constructor(private httpClient:HttpClient) { }  

  login(username:string,password:string){
    
    return this.httpClient.post(this.url,{username,password}).pipe(
      map(token=>{
        this.setUser({username,password,token})
        this.currentUserSubject.next({username,password,token})
        return {username,password,token}
      }),
      catchError((error:HttpErrorResponse)=>{
        return throwError(()=>error)
      })
    )
   
  }

  getUser(){
    if(isPlatformBrowser(this.platformId)){ 
      const user = localStorage.getItem("user")
      return user?JSON.parse(user):null
    }
    return null
  }

  setUser(user:any){
    if(isPlatformBrowser(this.platformId)){ 
      localStorage.setItem("user",JSON.stringify(user))
    }
  }

  get currentUser():Observable<any>{
    return this.currentUserSubject.asObservable()
  }

  isLoggedIn(){
    this.isLoggedinSubject.next(this.getUser()!==null)
    return  this.isLoggedinSubject.asObservable()
  }

  

  logout(){
    if(isPlatformBrowser(this.platformId)){ 
      localStorage.removeItem("user")
      this.isLoggedinSubject.next(false)
      this.currentUserSubject.next(null)
    }

   
  }
}
