import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CapitalLetterPipe } from '../../customPipes/capital-letter.pipe';
import {Sort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [NgFor,NgIf,MatSortModule,MatInputModule,MatFormFieldModule,FormsModule, AsyncPipe,CapitalLetterPipe],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent {


userService=inject(UsersService)
user$!:Subscription
users: User[]=[];
filteredUsers:User[]=[]
search: any;

  ngOnInit(){
    this.userService.getUsers()
    this.user$ = this.userService.users$.subscribe((users)=> {
      this.users=users
      this.filteredUsers = users
    });
  }

  ngOnDestroy(){
    this.user$.unsubscribe()
  }



  sortData(sort: Sort) {
    let data: User[] = this.filteredUsers

    if (!sort.active || sort.direction === '') {
      this.filteredUsers = data;
      return;
    }

    this.users = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'firstname':
          return compare(a.name.firstname, b.name.firstname, isAsc);
        case 'lastname':
          return compare(a.name.lastname, b.name.lastname, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'username':
          return compare(a.username, b.username, isAsc);
        case 'phone':
          return compare(a.phone, b.phone, isAsc);
        default:
          return 0;
      }
    });


  }//end of function

  searchUsers(e: string) {
    let searchUser:User[] = []
    let user_search=e.toLowerCase()
    searchUser = this.filteredUsers.filter((user)=>user.name.firstname.includes(user_search)||user.name.lastname.includes(user_search)||user.username.includes(user_search)||user.phone.includes(user_search))
    
    this.users = searchUser

  }//end of function

}//end of class

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}