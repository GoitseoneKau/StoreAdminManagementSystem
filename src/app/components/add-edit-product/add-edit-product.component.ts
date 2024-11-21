import { Product } from './../../models/product';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Component, computed, inject, input, model, output, Output, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, JsonPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { MatSelectModule } from '@angular/material/select';
import { CapitalLetterPipe } from "../../customPipes/capital-letter.pipe";
import { ErrorStateMatcher } from '@angular/material/core';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


//export Material fieldfrom error handler
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

//export Dialog interface
export interface DialogData {
  product: Product;
  productId: string;
}


@Component({
  selector: 'diag-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    CapitalLetterPipe
],
providers:[ CurrencyPipe]
,
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent {

  readonly dialogRef = inject(MatDialogRef<AddEditProductComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  addEditForm!:FormGroup;
  editForm:boolean =false;
  title:string=""

  categories: string[]=[];
  matcher = new MyErrorStateMatcher()

  productId=model();
  product=signal<Product>({
    title: '',
    price: '',
    category: '',
    description: '',
    image: ''
  })


  constructor(private formBuilder:FormBuilder,private productService:ProductsService,private currencyPipe:CurrencyPipe){
    //build formgroup
    this.addEditForm = this.formBuilder.group({
      title: new FormControl("",[Validators.required,Validators.minLength(5),Validators.max(40)]),
      price:new FormControl("",[Validators.required,Validators.min(0.01)]),
      category:new FormControl("",[Validators.required]),
      description:new FormControl("",[Validators.required,Validators.minLength(10)]),
      image:new FormControl("",[Validators.required,Validators.pattern("(http(s?)\\:\\/\\/)(([\\w]+\\.)?)([\\w]+)(\\.+)([\\w]+)(\\/)([\\w\\W]+)")])
    })

  }

  ngOnInit(){

    
    if(this.product().title.length>0){
      //set title to edit
      this.title ="Edit"
      //if product set,fill in form
      this.populateFields(this.product())
    }else{
      //set title to add
      this.title = "Add"
    }//end if

    //categories subscription
   this.productService
      .getProductCategories()
      .subscribe((categories) => (this.categories = categories))


  }

  //fill in form function
  populateFields(product:Product){
    
    //set form values from host component
      this.addEditForm.setValue({
        title:product.title,
        description:product.description,
        price:this.currencyPipe.transform(product.price,"","")!,
        category:product.category,
        image:product.image
    })
    
  }

  

  onSubmitProduct() {

    if(this.title=="Add"){

      //declare holder  variable
      let addProductData = this.addEditForm.value as Product

      //edit property in holder variable
      addProductData.rating! ={
        rate:0,
        count:0
      }
      
      let new_product:Product
      this.productService.postProduct(addProductData).subscribe({
        next:(product)=>{
          //assign loaded product result
          new_product=product
        },
        error:(error)=>{ this.dialogRef.close(error.error)},
        complete:()=>{
          //set product signal with assigned result
          this.product.set(new_product)
          //emit product signal to host closing event subscriptions
          this.dialogRef.close(this.product())
        }
      })

    }
    else{
       //declare holder  variable
      let updateProductData = this.addEditForm.value as Product

      //set id property in holder variable with host sent product id property
      updateProductData.id = this.product().id

      //temporary holder of result
      let updatedProd:Product

      this.productService.updateProduct(updateProductData).subscribe({
        next:(product)=>{
           //assign result to temporary holder
          updatedProd = product
        },
        error:(error)=>{ this.dialogRef.close(error.error)},
        complete:()=>{ 
          //emit assigned temporay holder to host closing event subscriptions
          this.dialogRef.close(updatedProd)
        }
      })
     
    }
  

    
  }


  cancel() {
    //close the dialog with no/null emitted value
    this.dialogRef.close(null)
  }    
}
