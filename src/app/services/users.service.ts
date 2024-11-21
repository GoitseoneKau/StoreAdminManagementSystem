import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, debounce, debounceTime, filter, map, Observable, skipWhile, takeUntil, takeWhile, tap } from 'rxjs';
import { User } from '../models/user';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
private url = "https://fakestoreapi.com/users"

private usersBehaviorSubject =  new BehaviorSubject<User[]|null>(null)
users$:Observable<User[]|null> = this.usersBehaviorSubject.asObservable()

user_name:string = ""

  constructor(private httpClient:HttpClient,private loginService:LoginService) {
    this.user_name = this.loginService.currentUser.username
   }

  getUsers():void{
    this.httpClient.get<User[]>(this.url)
    .pipe(
      map(
        (users)=>users.map((user)=>user.username === this.user_name ? ({...user,admin:true}) : ({...user,admin:false}) )
      ),
      filter((users:User[])=>!!users)
    ).subscribe(users=>this.usersBehaviorSubject.next(users))
  }

 

 get Users():Observable<User[]|null>{
  
  return this.users$
 }

 
}
