import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
private url = "https://fakestoreapi.com/users"
private usersBehaviorSubject =  new BehaviorSubject<User[]>([])
users$ = this.usersBehaviorSubject.asObservable()
  constructor(private httpClient:HttpClient) { }

  getUsers(){
   this.httpClient.get<User[]>(this.url)
    .pipe(map(
      (users)=>users.map(
        (user)=>user.username==="johnd"?({...user,admin:true}):({...user,admin:false}))
      )
    ).subscribe((users)=>this.usersBehaviorSubject.next(users))
  }

  updateUsers(data:User[]){
    this.usersBehaviorSubject.next(data)
  }
  
 
}
