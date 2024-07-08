import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PublicRoutes } from '../../public.routes';
import { DatetimeHelper } from 'src/app/_core/helpers/datetime.helper';
import { CommonService } from 'src/app/_core/services/common.service';
import { Images } from 'src/assets/data/images';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

  updateForm:FormGroup
  readonly signinBannerImage: string = Images.bannerRH;
  readonly sonatelBannerImage: string = Images.bannerLogo;
  readonly loginnlogoBannerImage: string = Images.mainLogo;
  hiddenn:string='block'
  blockk:string= 'block'
  hiddenns:string='block'
  blockks:string= 'block'
  isLoading: boolean = false;
  readonly publicRoutes = PublicRoutes;
  readonly currentYear: number = DatetimeHelper.currentYear;
  constructor(private fb:FormBuilder,
    public commonService: CommonService,
  ){
    this.updateForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      confirm_password:['',[Validators.required]],
    })
  }
  toggle=(event:string)=>{
       let targetElementPass = document.querySelector("#password") as HTMLInputElement;  
      let targetElementConf = document.querySelector("#confirmpassword") as HTMLInputElement;        
    
    if(targetElementPass){
      if(event==='password'){
      if(targetElementPass.type==="password"){
        targetElementPass.type='text';
        this.hiddenn='hidden'
        this.blockk='block'
      }else{
        targetElementPass.type = 'password'
        this.hiddenn='block'
        this.blockk='block'
      }
    }else if(event=="confirmPassword"){
      if(targetElementConf.type==="password"){
        targetElementConf.type='text';
        this.hiddenns='hidden'
        this.blockks='block'
      }else{
        targetElementConf.type = 'password'
        this.hiddenns='block'
        this.blockks='block'
      }
    }
    }
  }
  enregistrer()
  {

  }
}
