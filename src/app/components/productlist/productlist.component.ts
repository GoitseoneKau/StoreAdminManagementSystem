import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe, CommonModule, NgFor } from '@angular/common';
import { Product } from '../../models/product';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { delay, Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CapitalLetterPipe } from '../../customPipes/capital-letter.pipe';
import { LoaderService } from '../../services/loader.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CurrencyPipe,
    CapitalLetterPipe,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    NgxSpinnerModule,
    FormsModule,
  ],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css',
  changeDetection:ChangeDetectionStrategy.Default
})
export class ProductlistComponent {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);
  readonly dialog = inject(MatDialog);

 
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  products: Product[] = [];
  categories: string[] = [];
  filterProducts: Product[] = [];
  productsLength = this.productService.getProductLength();
  $ProductSubscription!: Subscription;
  $CategorySubscription!: Subscription;
  search: string = '';
  category: string = '';
  spinner = true;
  bdcolor!: string;
  animation_color!: string;
  loadingMessage: any;

  constructor(private ngxspinner: NgxSpinnerService) {}

  ngOnInit() {
    this.ngxspinner.show();

    //set background color to white,80% opacity
    this.bdcolor = 'rgba(255,255,255,0)';

    //set loader color to red
    this.animation_color = '#12a1f8';

    //set message
    this.loadingMessage = 'Loading..';

    this.$ProductSubscription = this.productService.getProducts().subscribe({
        next: (products) => {
            
            this.products =this.filterProducts = products.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));//store array sorted in ascending order of names

            this.animation_color = 'rgb(0, 208, 0)';

            //change message
            this.loadingMessage = 'Complete';

            setTimeout(()=>{//change loader to green
              this.ngxspinner.hide();
              this.spinner = false;
            },500)

            this.onPageChange({
              pageSize: 4,
              pageIndex: 0,
              length: this.productsLength,
            });
        },
        error:(er)=>{
            this.ngxspinner.hide();
            this.spinner = false;
           
        },
        complete:()=>{
         
        }
      });

    
    this.$CategorySubscription = this.productService
      .getProductCategories()
      .subscribe((categories) => (this.categories = categories));

  }//end of function


  ngOnDestroy() {
    this.$ProductSubscription.unsubscribe();
    this.$CategorySubscription.unsubscribe();
  }


  onPageChange(e: PageEvent) {
    let products: Product[];

   
    if (this.category != '' && this.search == '') {  //if category is not empty and search is empty

      products = this.filterProducts.filter((product) => this.category == ''? product.category.includes(this.category) : product.category.indexOf(this.category) == 0);
    
    }   
    else if (this.search != '' && this.category == '') {//if category is not empty and search is empty

      products = this.filterProducts.filter((product) => product.title.includes(this.search));

    }
    else if (this.search != '' && this.category != '') { //if category is not empty and search is empty

      products =  this.filterProducts
                      .filter((product) =>
                        this.category == ''? product.category.includes(this.category): product.category.indexOf(this.category) == 0
                      )
                      .filter((product) => product.title.includes(this.search));

    } 
    else {
      products = this.filterProducts;
    }//end if

    //paginator element;set attributes dynamically
    if(this.paginator){
      this.paginator.pageIndex = e.pageIndex;
      this.paginator.pageSize = e.pageSize;
      this.paginator.length = products.length;
    }

    let index = e.pageIndex * e.pageSize;
    let endindex = index + e.pageSize;

    this.products = products.slice(index, endindex);
  }


  categoryChange(e: string) {
    let category_text = e.indexOf(' ') > 0 ? e.substring(0, e.indexOf(' ')) : e;

    let products;
    if (this.search != '') {
      products = this.filterProducts.filter((product) => product.title.includes(this.search));
    } 
    else {
      products = this.filterProducts;
    }//end if

    this.products = products.filter((product) => category_text == '' ? product.category.includes(category_text) : product.category.indexOf(category_text) == 0);

    this.productsLength = this.products.length;
    this.onPageChange({
      pageSize: 4,
      pageIndex: 0,
      length: this.productsLength,
    });
  }


  searchProducts(e: string) {
    let search_text = e.toLowerCase();

    let products;

    if (this.category != '') {
      products = this.filterProducts.filter((product) => this.category == ''? product.category.includes(this.category) : product.category.indexOf(this.category) == 0 );
    } 
    else {
      products = this.filterProducts;
    }//end if

    this.products = products.filter((product) => product.title.includes(search_text));

    this.productsLength = this.products.length;
    this.onPageChange({
      pageSize:  this.paginator.pageSize,
      pageIndex: 0,
      length: this.productsLength,
    });

  } //end of function

  getNextId(obj:any):number{
    return (Math.max.apply(Math,obj.map((o: { id: number })=>o.id))+1);///get next id from array/object list
  }

  addProduct(){

    let addDialog = this.dialog.open(AddEditProductComponent)
    

    addDialog.afterClosed().subscribe((result:Object)=>{
        let prods = this.filterProducts;
        if(result.toString().includes("message")){
          let errorDialog = this.dialog.open(ErrorDialogComponent)
          errorDialog.componentInstance.Error.set(result)
        }
        else if(result!=null&&!result.toString().includes("message")){
          let new_product = result as Product
          new_product.id = this.getNextId(this.filterProducts)
          prods.push(new_product);

          this.products = this.filterProducts= prods.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
          this.productsLength = this.products.length;
  
          console.log(this.products);
  
          this.onPageChange({
            pageSize: 4,
            pageIndex: 0,
            length: this.productsLength,
          });
        }
       

    })

    
    
   
 
  }//end of function

  editProduct(prod:Product){

    let dialogRef = this.dialog.open(AddEditProductComponent)
    dialogRef.componentInstance.product.set(prod)
   let sub= dialogRef.afterClosed().subscribe((result)=>{
    
          if(result.message){
            let errorDialog = this.dialog.open(ErrorDialogComponent)
            errorDialog.componentInstance.Error.set(result.message)
          }
          else if(result!=null&&!result.message){
            
            let changedProducts: Product[]=[]
            this.products.map((product)=>{

              let new_prod = result
            
              if(product.id===prod.id){
                console.log(prod.id)
                changedProducts.push({...product,price:new_prod.price,description:new_prod.description,category:new_prod.category,title:new_prod.title,image:new_prod.image})
              }else{
                changedProducts.push(product)
              }
            
            })
           
            this.products=this.filterProducts= changedProducts
          }
    })

    //sub.unsubscribe()

  }//end of function


  deleteProduct(product:Product){
    let deleteProd = this.filterProducts
    this.products = this.filterProducts = deleteProd.filter((p)=>product.id!=p.id)
    console.log(this.products)
    this.productsLength = this.products.length
    this.onPageChange({
      pageSize:this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex,
      length: this.productsLength,
    });


  }//end of function


  productDetails(id: number) {
    this.router.navigate([`product-details/${id}`], {
      relativeTo: this.activeRoute.parent,
    });
  }//end of function

}
