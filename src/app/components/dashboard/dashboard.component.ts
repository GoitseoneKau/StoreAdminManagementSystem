import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { catchError, filter, skipWhile, Subscription } from 'rxjs';
import { cart } from '../../models/cart';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { CapitalLetterPipe } from "../../customPipes/capital-letter.pipe";
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CapitalLetterPipe,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection:ChangeDetectionStrategy.Default
})
export class DashboardComponent {

  LoginService = inject(LoginService)
  cartService$ = inject(CartService)
  productService$ = inject(ProductsService)
  userService = inject(UsersService)

  user_name = ""
  user_surname=""
  current_user:string=""
  user!:User;

  carts:cart[] = []
  categories:string[]=[]
  products:Product[]=[]
  colors:string[]=["blue","red","yellow darken-1","green"]
  users:User[] =[]

  cart_subscription$!:Subscription 
  category_subscription$!:Subscription 
  users_subscription$!: Subscription;
  login_subscription$!: Subscription;

  user_count:number=0;
  admin_count: number=0;

  constructor(){}

  ngOnInit(){

      //product subscription
      this.productService$.getProducts().subscribe(((products)=>{
        this.products = products
      }))

      //cart subscription
      this.cart_subscription$ = this.cartService$.getCartProducts().subscribe((carts)=>{
          
        this.carts= carts
      
        this.displayCart()
      
      })

      //category subscription
      this.category_subscription$ = this.productService$.getProductCategories()
      .subscribe((categories)=> this.categories = categories as string[])
    

      //login subscription;current user
      this.current_user = this.LoginService.currentUser.username
      
      //users subscription
      this.userService.getUsers()

      this.userService.Users.pipe(filter((users):users is User[]=>!!users)).subscribe(
        (users)=>{
          //get global users
          this.users = users
          
          //filter admin role and store length of users and admin
          this.user_count = this.users.filter(user=>!user.admin).length
          this.admin_count = this.users.filter(user=>user.admin).length
          
          //filter current user details from users
          this.user=users.filter((u: User) => u.username === this.current_user)[0]
          
          //set global name and surname of user for ui
          this.user_name= this.user.name.firstname
          this.user_surname=this.user.name.lastname
      })
     

   
  }

  ngOnDestroy(){
    this.cart_subscription$.unsubscribe()
    this.category_subscription$.unsubscribe()
   // this.login_subscription$.unsubscribe()
  }


  displayCart(){
    let cart = this.carts.map((Cart)=>{
                    let new_carProduct: { category: string; productId: number; quantity: number; }[] =[]
                  
                        this.products.forEach(product=>{
                          Cart.products.forEach((cart_prod)=>{
                            if(cart_prod.productId==product.id){
                              new_carProduct.push(({...cart_prod,category:product.category}))
                            }
                          })
                        })
                  
                    

                    return ({ ...Cart, products: new_carProduct }) as cart
                })

    this.carts = cart
  }


  getTotalQuantity(carts:cart[],category:string){
    let total =0;
    carts.forEach((cart:cart)=>{
     
      cart.products.forEach(p=>{
        if(p.category==category){
          total+=p.quantity
        }
      })
      
    })

    return total
  }



}
