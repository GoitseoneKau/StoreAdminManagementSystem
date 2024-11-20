import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
private url = "https://fakestoreapi.com/users"
private usersBehaviorSubject =  new BehaviorSubject<User[]>([])
users$ = this.usersBehaviorSubject.asObservable()
  constructor(private httpClient:HttpClient,private loginService:LoginService) { }

  getUsers(){
   this.httpClient.get<User[]>(this.url)
    .pipe(map(
      (users)=>users.map(
        (user)=>{
          let user_name;
          this.loginService.currentUser.subscribe((user_data)=>{user_name=user_data.username})
         return user.username===user_name?({...user,admin:true}):({...user,admin:false})
        }
      )
      )
    ).subscribe((users)=>this.usersBehaviorSubject.next(users))
  }

  updateUsers(data:User[]){
    this.usersBehaviorSubject.next(data)
  }
  
 
}
