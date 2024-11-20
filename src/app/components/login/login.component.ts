import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MyErrorStateMatcher } from '../add-edit-product/add-edit-product.component';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //material error matcher
  matcher = new MyErrorStateMatcher()

  loginForm!:FormGroup
  error:string=""

  constructor(private formBuilder:FormBuilder,private loginService:LoginService,private router:Router){
    //form group
    this.loginForm = this.formBuilder.group({
      username:new FormControl("",[Validators.required]),
      password:new FormControl("",[Validators.required])
    })
  }


  onSubmit(){
    //get values from login form
    let username=this.loginForm.get('username')?.value
    let password=this.loginForm.get('password')?.value
  
   this.loginService.login(username,password).subscribe({
    next:(token)=>{
      //if succesfull redirect to dashboard
      this.router.navigate(["/admin/dashboard"],{replaceUrl:true})
    },
    error:(error)=>{
      //if unsuccessfuul return error
      if(error.status==401){
        //if unknown error
        this.error = "failed to login,check your password and username"
      }if(error.status==0){
        //if unstable/no interne connection
        this.error = "No connection. Check Your internet"
      }
    }
   })
  }


}
