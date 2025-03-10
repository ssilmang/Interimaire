import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicRoutes} from "../public.routes";
import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  {
    title: "signup",
    path: PublicRoutes.Signup,
    component: SignupComponent
  },
  {
    title: "Signin",
    path: PublicRoutes.Signin,
    component: SigninComponent
  },
  {
    title: "forget",
    path: PublicRoutes.Forget,
    component: ForgetPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
