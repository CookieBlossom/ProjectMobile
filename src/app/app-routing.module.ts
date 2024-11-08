import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'shopping-cart',
    loadChildren: () => import('./pages/shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
  },
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'panel-adm',
    loadChildren: () => import('./pages/panel-adm/panel-adm.module').then( m => m.PanelAdmPageModule)
  },
  {
    path: 'adm-products',
    loadChildren: () => import('./pages/adm-products/adm-products.module').then( m => m.AdmProductsPageModule)
  },
  {
    path: 'adm-modify/:id',
    loadChildren: () => import('./pages/adm-modify/adm-modify.module').then( m => m.AdmModifyPageModule)
  },
  {
    path: 'modify-profile',
    loadChildren: () => import('./pages/modify-profile/modify-profile.module').then( m => m.ModifyProfilePageModule)
  },
  {
    path: 'panel-add',
    loadChildren: () => import('./pages/panel-add/panel-add.module').then( m => m.PanelAddPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./pages/maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error-page/error-page.module').then( m => m.ErrorPagePageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, { preloadingStrategy: PreloadAllModules }

    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
