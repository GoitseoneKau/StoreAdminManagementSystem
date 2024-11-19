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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, CapitalLetterPipe,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection:ChangeDetectionStrategy.Default
})
export class DashboardComponent {

  cartService$ = inject(CartService)
  productService$ = inject(ProductsService)
  userService$ = inject(UsersService)

  carts:cart[] = []
  categories:string[]=[]
  products:Product[]=[]
  colors:string[]=["blue","red","yellow darken-1","green"]

  cart_subscription$!:Subscription 
  category_subscription$!:Subscription 
  users_subscription$!: Subscription;

  user_count:number=0;
  admin_count: number=0;
constructor(){
 
}

  ngOnInit(){

    this.productService$.getProducts().subscribe(((products)=>{
      this.products = products
    }))

    this.cart_subscription$ = this.cartService$.getCartProducts().subscribe((carts)=>{
         
        this.carts= carts
      
        this.displayCart()
      
    })
        

    this.category_subscription$ = this.productService$.getProductCategories()
    .subscribe((categories)=> this.categories = categories as string[])
      
    this.userService$.getUsers()

    this.users_subscription$ = this.userService$.users$.subscribe((users)=>{
      this.user_count = users.filter(user=>!user.admin).length
      this.admin_count = users.filter(user=>user.admin).length
    })
 
  }

  ngOnDestroy(){
    //this.cart_subscription$.unsubscribe()
    this.category_subscription$.unsubscribe()
    this.users_subscription$.unsubscribe()
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
