import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './auth/signin/signin.component';

const routes: Routes = [

  {
    path: '',
    title: 'Home',
    component: SigninComponent,
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
