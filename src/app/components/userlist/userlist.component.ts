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
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [NgFor,NgIf,MatSortModule,MatInputModule,MatFormFieldModule,FormsModule, AsyncPipe,CapitalLetterPipe],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent {

  //services
loginService=inject(LoginService)
userService=inject(UsersService)

//variables
user$!:Subscription
users: User[]=[];
filteredUsers:User[]=[]
search: any;
admin!:User

  ngOnInit(){
    this.userService.getUsers()//fetch users

    this.user$ = this.userService.users$.subscribe((users)=> {//user subscription to subjectBehaviour
      //main users array
      this.users=users
      //holder array variable for filter
      this.filteredUsers = users

      //temporary holder variable
      let tempuser: { username: string; }
      this.loginService.currentUser.subscribe((current_user)=>{//login subscription
        //get current user
        tempuser = current_user
      })

      this.admin = users.filter((user)=>user.username==tempuser.username)[0]//join current user with user from list;filter
      
    });
  }

  ngOnDestroy(){
    this.user$.unsubscribe()//unsusbscribe to user subscription
  }



  sortUsers(sort: Sort) {
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
      }//end of switch

    });//end of sort function


  }//end of function

  searchUsers(e: string) {
    let searchUser:User[] = []
    let user_search=e.toLowerCase()
    searchUser = this.filteredUsers.filter((user)=>user.name.firstname.includes(user_search)||user.name.lastname.includes(user_search)||user.username.includes(user_search)||user.phone.includes(user_search))
    
    this.users = searchUser

  }//end of function

}//end of class

function compare(a: number | string, b: number | string, isAsc: boolean) {
  //sort logic
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}//end of function