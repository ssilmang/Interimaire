import { Component, NgModule } from '@angular/core';
import { DatetimeHelper } from 'src/app/_core/helpers/datetime.helper';
import { CommonService } from 'src/app/_core/services/common.service';
import { pageTransition } from 'src/app/shared/utils/animations';
import { PublicRoutes } from '../../public.routes';
import { Router, RouterLink } from '@angular/router';
import { AppRoutes } from 'src/app/app.routes';
import { AdminRoutes } from 'src/app/admin/admin.routes';
import { Images } from 'src/assets/data/images';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestataireService } from 'src/app/_core/services/prestataire.service';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [pageTransition],
})
export class SignupComponent {
  readonly alertType = AlertType;
  readonly signupbannerImage:string = Images.bannerRH
  readonly sonatelbannerImage:string = Images.bannerLogo
  readonly loginnbannerImage:string = Images.mainLogo
  isLoading: boolean = false;
  hiddenn:string='block'
  blockk:string= 'block'
  hiddenns:string='block'
  blockks:string= 'block'
  readonly currentYear: number = DatetimeHelper.currentYear;
  readonly publicRoutes = PublicRoutes;
  formSignup:FormGroup;
  message:string="";
  showModal:boolean=false;
  footer:boolean=false;
  close:boolean = false;
  messageError:string="";
  messageAttention:string="";
  messageInfo:string="";
  constructor(
    public commonService: CommonService,
    private router: Router,
    private fb:FormBuilder,
    private service:PrestataireService,
  ) { 
    this.formSignup = this.fb.group({
      prenom:['',[Validators.required,Validators.pattern('[a-zA-Z" "]*'),Validators.minLength(3),Validators.maxLength(200)]],
      nom:['',[Validators.required,Validators.pattern('[a-zA-Z]*'),Validators.minLength(2),Validators.maxLength(200)]],
      username:[],
      email:['',[Validators.email,Validators.required]],
      matricule:[,[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
      telephone:['',[Validators.required,Validators.minLength(9),Validators.maxLength(12),Validators.pattern("^[0-9]*$")]],
      telephone_pro:[],
      password:[,[Validators.required]],
      confirm_password:[,[Validators.required,this.confirme_password]],
      role:[,[Validators.required]],
    })
  }
  confirme_password(control:AbstractControl):{[key:string]:boolean}|null
  {
    let confirm = control.value;
    let password = control.parent?.get('password');
    if(password?.valid && confirm!==password.value){
      return {"confirme":true}
    }
    return null
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
  Submit = () => {
   console.log(this.formSignup.value);
   this.service.registrer(this.formSignup.value).subscribe({
    next:(response)=>{
      console.log(response);
      if(response.statut===200){
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate([this.commonService.prepareRoute(this.publicRoutes.Signin)] );
        }, 3000);
      }
    }
   })

    
  }
}
