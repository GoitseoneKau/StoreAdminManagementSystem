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



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


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

  dataOutput=output<any>() 
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
  productCom = computed(()=>this.product())

  constructor(
    private formBuilder:FormBuilder,
    private productService:ProductsService,
    private currencyPipe:CurrencyPipe
  ){
    this.addEditForm = this.formBuilder.group({
      title: new FormControl("",[Validators.required,Validators.minLength(5),Validators.max(40)]),
      price:new FormControl("",[Validators.required,Validators.min(0.01)]),
      category:new FormControl("",[Validators.required]),
      description:new FormControl("",[Validators.required,Validators.minLength(10),Validators.max(80)]),
      image:new FormControl("",[Validators.required,Validators.pattern("(http(s?)\\:\\/\\/)(([\\w]+\\.)?)([\\w]+)(\\.+)([\\w]+)(\\/)([\\w\\W]+)")])
    })

  }

  ngOnInit(){

    if(this.product().title.length>0){
      this.title ="Edit"
      this.populateFields(this.product())
    }else{
      this.title = "Add"
    }

   this.productService
      .getProductCategories()
      .subscribe((categories) => (this.categories = categories))


  }

  populateFields(product:Product){
    
      this.addEditForm.setValue({
        title:product.title,
        description:product.description,
        price:this.currencyPipe.transform(product.price,"","")!,
        category:product.category,
        image:product.image
      
    })
    
  }

   getData(e:Event){
    return this.dataOutput.emit(e)
   }

  onSubmitProduct() {

    if(this.title=="Add"){

      let addProductData = this.addEditForm.value as Product
      
      addProductData.rating! ={
        rate:0,
        count:0
      }
      console.log(addProductData.rating)
      let prod:Product
      this.productService.postProduct(addProductData).subscribe({
        next:(product)=>{
          prod=product
        },
        error:(error)=>{ this.dialogRef.close(error.error)},
        complete:()=>{
          this.product.set(prod)
          this.dialogRef.close(this.product())
        }
      })

    }
    else{
      let updateProductData = this.addEditForm.value as Product
      updateProductData.id = this.product().id!
      let updatedProd:Product
      this.productService.updateProduct(updateProductData).subscribe({
        next:(product)=>{updatedProd = product},
        error:(error)=>{ this.dialogRef.close(error.error)},
        complete:()=>{ 
          this.dialogRef.close(updatedProd)
        }
      })
     
    }
  

    
  }


  cancel() {
    this.dialogRef.close(null)
  }    
}
