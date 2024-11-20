import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [NgIf],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent {

  //service injctions
  productService =inject(ProductsService)
  activeRoute =inject(ActivatedRoute)

  //product variable
  product!:Product
  
  ngOnInit(){
    //id from url prameter
    const id = this.activeRoute.snapshot.paramMap.get('id')
    //product service subscription
    this.productService.getProduct(+id!).subscribe((product)=>{
        this.product = product
    })
  }

}
