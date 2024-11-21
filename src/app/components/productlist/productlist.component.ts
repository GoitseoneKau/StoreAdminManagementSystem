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
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductlistComponent {
  //service injections
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);
  readonly dialog = inject(MatDialog);

  //paginator element
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //array variables
  products: Product[] = [];
  categories: string[] = [];
  filterProducts: Product[] = [];
  productsLength = this.productService.getProductLength();

  //subscription variables
  $ProductSubscription!: Subscription;
  $CategorySubscription!: Subscription;

  //variables
  search: string = '';
  category: string = '';
  spinner = true;
  bdcolor!: string;
  animation_color!: string;
  loadingMessage: any;

  constructor(private ngxspinner: NgxSpinnerService) {}

  ngOnInit() {
    //show loader
    this.ngxspinner.show();

    //set background color to white,80% opacity
    this.bdcolor = 'rgba(255,255,255,0)';

    //set loader color 
    this.animation_color = '#12a1f8';

    //set message
    this.loadingMessage = 'Loading..';

    this.$ProductSubscription = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = this.filterProducts = products.map((product)=>{
          product.title = product.title.toLowerCase()
          return product
        })
        .sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0
        ); //store array sorted in ascending order of names

        //changer loader color
        this.animation_color = 'rgb(0, 208, 0)';

        //change message
        this.loadingMessage = 'Complete';

        setTimeout(() => {
          //change loader to green
          this.ngxspinner.hide();
          this.spinner = false;
        }, 500);

        //update paginator
        this.onPageChange({
          pageSize: 4,
          pageIndex: 0,
          length: this.productsLength,
        });
      },
      error: (error) => {
        const ErrorDialog =this.dialog.open(ErrorDialogComponent)
        ErrorDialog.componentInstance.Error.set(`${error.error.message}. Please check your internet connetion.\n Press 'Close' to try again or please try again in 5 seconds`)
       ErrorDialog.afterClosed().subscribe(()=>{
          window.location.reload()
         //hide loader
         this.ngxspinner.hide();
         this.spinner = false;
       })
      }
    });

    //product category subscription
    this.$CategorySubscription = this.productService
      .getProductCategories()
      .subscribe((categories) => (this.categories = categories));
  } //end of function


  ngOnDestroy() {
    this.$ProductSubscription.unsubscribe();
    this.$CategorySubscription.unsubscribe();
  }


  onPageChange(e: PageEvent) {

    //temporary holder
    let products: Product[];

    //search holder
    let search = this.search.toLowerCase()

    if (this.category != '' && this.search == '') {//if category is not empty and search is empty
      
      //store to temp holder category filtered array
      products = this.filterProducts.filter((product) =>
        this.category == ''
          ? product.category.includes(this.category)
          : product.category.indexOf(this.category) == 0
      );

    } else if (this.search != '' && this.category == '') {//if category is not empty and search is empty
      
      //store to temp holder title filtered array
      products = this.filterProducts.filter((product) =>
        product.title.includes(search)
      );

    } 
    else if (this.search != '' && this.category != '') {//if category is not empty and search is empty
      
    //store to temp holder title and category filtered array
      products = this.filterProducts
        .filter((product) =>
          this.category == ''
            ? product.category.includes(this.category)
            : product.category.indexOf(this.category) == 0
        )
        .filter((product) => product.title.includes(search));

    } else {

      //store to temp holder unfiltered array
      products = this.filterProducts;

    } //end of if

    //paginator element;set attributes dynamically
    if (this.paginator) {

      //paginator page index
      this.paginator.pageIndex = e.pageIndex;

      //paginator page size
      this.paginator.pageSize = e.pageSize;

      //paginator array/data length
      this.paginator.length = products.length;

    }//end of if

    //current start index
    let index = e.pageIndex * e.pageSize;

    //current end index
    let endindex = index + e.pageSize;

    //cut current array according to paginator settings
    this.products = products.slice(index, endindex);
  }


  //category selector change event function
  categoryChange(e: string) {

    //store category search text
    let category_text = e.indexOf(' ') > 0 ? e.substring(0, e.indexOf(' ')) : e;

    //search holder
    let search = this.search
    
    //temp holder
    let products;
    if (this.search !== '' && this.category !== '') {

      //store to temp holder title filtered array
      products = this.filterProducts.filter((product) =>
        product.title.includes(search.toLowerCase())
      );

      //store categor filtered array to current array
      this.products = products.filter((product) =>
      category_text == ''
        ? product.category.includes(category_text)
        : product.category.indexOf(category_text) == 0
    );
    } else if(this.search==""){

       //store to temp holder unfiltered array
      products = this.filterProducts;

      //store categor filtered array to current array
    this.products = products.filter((product) =>
      category_text == ''
        ? product.category.includes(category_text)
        : product.category.indexOf(category_text) == 0
    );
    
    } //end if

    
    //update current array length
    this.productsLength = this.products.length;

    //update paginator
    this.onPageChange({
      pageSize: 4,
      pageIndex: 0,
      length: this.productsLength,
    });

  }//end of function



  //search textfield change event function
  searchProducts(e: string) {

    //search text variable;to lowercase
    let search_text = e.toLowerCase();

    //temp holder variable
    let products;

    //if category is not empty
    if (this.category !== '') {
 
      //store to temp holder category filtered array
      products = this.filterProducts.filter((product) =>
        this.category == ''
          ? product.category.includes(this.category)
          : product.category.indexOf(this.category) == 0
      );

    } else {

      //store to temp holder unfiltered array
      products = this.filterProducts;

    } //end if


    //store search text filtered array to current array
    this.products = products.filter((product) =>product.title.includes(search_text));
    
    //update current product array length
    this.productsLength = this.products.length;

    //update paginator
    this.onPageChange({
      pageSize: this.paginator.pageSize,
      pageIndex: 0,
      length: this.productsLength,
    });

  } //end of function

  getNextId(obj: any): number {

    return (
      Math.max.apply(
        Math,
        obj.map((o: { id: number }) => o.id)
      ) + 1
    ); //get next id from array/object list

  }//end of function


  //add button event function
  addProduct() {

    //open add dialog box
    let addDialog = this.dialog.open(AddEditProductComponent); 

    //subscribe to fterclose event of add dialog box
    addDialog.afterClosed().subscribe((result: Object) => {
       //temporary array holder
      let prods = this.filterProducts;

      if (result != null && typeof result == 'string') {

        //open error dialog if error string
        let errorDialog = this.dialog.open(ErrorDialogComponent); 

         //set input variable to error dialog instance
        errorDialog.componentInstance.Error.set(result);

      } else if (result != null) {

         //temporary result holder
        let new_product = result as Product;

         //generate new id for new product item
        new_product.id = this.getNextId(this.filterProducts);

        //push new product item to temporary holder array
        prods.push(new_product);

        //store;sort in ascending order the array to curent array variables
        this.products = this.filterProducts = prods.sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0
        );

        // update products array length
        this.productsLength = this.products.length;

        //update paginator
        this.onPageChange({
          pageSize: 4,
          pageIndex: 0,
          length: this.productsLength,
        });

      } //end of if
      
    }); //end of subscription

  } //end of function


  //edit button event function
  editProduct(prod: Product) {
    //open a dialog box
    let editDialog = this.dialog.open(AddEditProductComponent); 

    //set the input variable within it's instance
    editDialog.componentInstance.product.set(prod);

     //subscribe to dialog after close event
    editDialog.afterClosed().subscribe((result: any) => {

      if (result != null && typeof result == 'string') {

        //open dialog box for error
        let errorDialog = this.dialog.open(ErrorDialogComponent); 

        //set input variable within dialog instance
        errorDialog.componentInstance.Error.set(result); 

      } else if (result != null) {

         //temporary holder array
        let changedProducts: Product[] = [];

         //map product array
        this.products.map((product) => {
         
          //product result from edit dialog
          let new_prod = result; 

           //if product result matches current product
          if (product.id === prod.id) {
           
            //push changed/edited product item to temporary holder array
            changedProducts.push({
              ...product,
              price: new_prod.price,
              description: new_prod.description,
              category: new_prod.category,
              title: new_prod.title,
              image: new_prod.image,
            });
          } else {
            // else push unmatched product item
            changedProducts.push(product);
          }
        }); //end of map function

        //store changed array
        this.products = this.filterProducts = changedProducts; 
      }
    }); //end of subscription
  } //end of function


  //delete button event function
  deleteProduct(product: Product) {
    //temp holder
    let deleteProd = this.filterProducts; 

    //store filtered array
    this.products = this.filterProducts = deleteProd.filter(
      (p) => product.id != p.id
    ); //filter out the deleted item

    //update curent array length
    this.productsLength = this.products.length;

    // update paginator,with current paginator values;current arrray length
    this.onPageChange({
      pageSize: this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex,
      length: this.productsLength,
    });
  } //end of function

  //function to navigate to product details link
  productDetails(id: number) {
    //navigate
    this.router.navigate([`product-details/${id}`], {
      relativeTo: this.activeRoute.parent,
    });
  } //end of function

}
