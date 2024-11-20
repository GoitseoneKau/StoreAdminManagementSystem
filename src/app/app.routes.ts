import { authguard } from './guards/authguard.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {path:"",redirectTo:"login",pathMatch:"full"},
    {path:"login",component:LoginComponent,title:"login"},
    {path:"admin",component:AdminComponent,
        children:[   
            {path:"product-list",component:ProductlistComponent,title:"Product List"},
            {path:"product-details/:id",component:ProductdetailsComponent,title:"Product Details"},
            {path:"dashboard",component:DashboardComponent,title:"Dashboard"},
            {path:"user-list",component:UserlistComponent,title:"User List"}
        ],
        canActivate:[authguard]
    },
    {path:"**",redirectTo:"login"}
];
