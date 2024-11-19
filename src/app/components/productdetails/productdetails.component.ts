import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [RouterOutlet,NgIf],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent {

  productService =inject(ProductsService)
  activeRoute =inject(ActivatedRoute)
  product!:Product
  
  ngOnInit(){
    const id = this.activeRoute.snapshot.paramMap.get('id')
    this.productService.getProduct(+id!).subscribe((product)=>{
        this.product = product
    })
  }

}
