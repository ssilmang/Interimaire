import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";
import {ValidationErrorComponent} from "../../shared/components/validation-error/validation-error.component";
import {AlertComponent} from "../../shared/components/alert/alert.component";
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { RouterLink } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    ForgetPasswordComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SpinnerComponent,
    ValidationErrorComponent,
    AlertComponent,
    ModalModule,
    FormsModule,
  ],
  exports: [
    SigninComponent,
    SignupComponent,
  ]
})
export class AuthModule { }
