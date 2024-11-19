export interface cart{
    id:number,
    userId:number,
    products:[{
      productId:number,
      quantity:number,
      category?:string
    }]
}
