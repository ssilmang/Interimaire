import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatetimeHelper } from 'src/app/_core/helpers/datetime.helper';
import { CommonService } from 'src/app/_core/services/common.service';
import { AdminRoutes } from 'src/app/admin/admin.routes';
import { AppRoutes } from 'src/app/app.routes';
import { pageTransition } from 'src/app/shared/utils/animations';
import { Images } from 'src/assets/data/images';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { PublicRoutes } from '../../public.routes';
import { dataUser } from 'src/app/_core/interface/interim';
import { PrestataireService } from 'src/app/_core/services/prestataire.service';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [pageTransition],
})
export class SigninComponent implements OnInit, AfterViewInit {
  readonly signinBannerImage: string = Images.bannerRH;
  readonly sonatelBannerImage: string = Images.bannerLogo;
  readonly loginnlogoBannerImage: string = Images.mainLogo;

  isLoading: boolean = false;
  readonly publicRoutes = PublicRoutes;
  readonly currentYear: number = DatetimeHelper.currentYear;
  target:string='';
  message:string="";
  serverErrors: string[] = [];
  hiddenn:string='block'
  blockk:string= 'block'
  signInForm = this.formBuilder.group({
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
  });
  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
     private userService: PrestataireService,
     private shared:LocalStorageService,
     private cdRef:ChangeDetectorRef,
  ) {}
  protected readonly AlertType = AlertType;
    ngAfterViewInit(): void { 
    }
    ngOnInit(): void {  
      this.shared.currentLogout.subscribe(ele=>{
        if(ele){
          this.shared.destroy();
          this.cdRef.detectChanges();
        }
      })  
    }
    toggle=()=>{
      const targetElement = document.querySelector("#hs-toggle-password") as HTMLInputElement;    
      if(targetElement){
        if(targetElement.type==="password"){
          targetElement.type='text';
          this.hiddenn='hidden'
          this.blockk='block'
        }else{
          targetElement.type = 'password'
          this.hiddenn='block'
          this.blockk='block'
        }
      }
    }
   FormSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    this.isLoading = true;
    let data:dataUser={
      'username':this.signInForm.get('username')?.value!,
      'password':this.signInForm.get('password')?.value!,
    }
    this.userService.login(data).subscribe({
      next:(response)=>{
       if(response.statut===200){
          this.shared.destroy();
          this.shared.put('user',JSON.stringify(response.data.user));
          this.shared.put("token",response.data.token)
          // this.message=response.message;
          this.isLoading = true;
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate([AppRoutes.Admin, AdminRoutes.Dashboard]);
          }, 3000);
       }else{
        this.message =response.message;
       }
        },
      error: (error) => {
        this.isLoading = false;
        this.message= error.error.message;
        this.serverErrors = [error.message];
      }
    });
  };
  protected onAlertCloseHandler = (e: any) => {
    this.serverErrors = [];
  };
}
// event.preventDefault();
    // this.isLoading = true;

    // setTimeout(() => {
    //   this.isLoading = false;
    //   this.router.navigate([AppRoutes.Admin, AdminRoutes.Dashboard]);
    // }, 3000);
