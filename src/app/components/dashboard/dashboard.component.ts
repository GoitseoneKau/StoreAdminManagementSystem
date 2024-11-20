import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { catchError, Subscription } from 'rxjs';
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
  userService$ = inject(UsersService)

  user_name = ""
  user_surname=""
  user: { username: string }={username:""};

  carts:cart[] = []
  categories:string[]=[]
  products:Product[]=[]
  colors:string[]=["blue","red","yellow darken-1","green"]

  cart_subscription$!:Subscription 
  category_subscription$!:Subscription 
  users_subscription$!: Subscription;
  login_subscription$!: Subscription;

  user_count:number=0;
  admin_count: number=0;
constructor(){
 
}

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
    
    //get Users
    this.userService$.getUsers()

    //login subscription
    this.login_subscription$ = this.LoginService.currentUser
    .subscribe((data)=>{
      this.user =data
      //users subscription
      this.users_subscription$ = this.userService$.users$
      .subscribe((users)=>{

        this.user_count = users.filter(user=>!user.admin).length
        this.admin_count = users.filter(user=>user.admin).length

        let user = users.filter((user)=>{
          if(user){ return user.username==this.user.username}
         return
        })[0]
       
          this.user_name = user.name.firstname
          this.user_surname = user.name.lastname
        
      })

    })

   
  }

  ngOnDestroy(){
    //this.cart_subscription$.unsubscribe()
    this.category_subscription$.unsubscribe()
    this.users_subscription$.unsubscribe()
    this.login_subscription$.unsubscribe()
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
