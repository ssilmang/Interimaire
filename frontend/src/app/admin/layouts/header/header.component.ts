import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonService } from 'src/app/_core/services/common.service';
import { Images } from 'src/assets/data/images';
import { AdminRoutes, ElementRoutes, SettingRoutes } from '../../admin.routes';
import { AppRoutes } from 'src/app/app.routes';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { PublicRoutes } from 'src/app/public/public.routes';
import { Router } from '@angular/router';
import { User, UserToken, dataUser } from 'src/app/_core/interface/interim';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit{
  public userOne: string = Images.users.userOne;
  readonly appRoutes = AppRoutes;
  readonly adminRoutes = AdminRoutes;
  readonly settingRoutes = SettingRoutes;
  readonly elementRoutes = ElementRoutes;
  public dataUser?:User;
  themeBackground:string="bg-white";
  profile:string="";
  isOpen: boolean = false;
  ngAfterViewInit(): void {
    this.getUser();
    this.profile = this.getUserInitials(`${this.dataUser?.prenom} ${this.dataUser?.nom}`)  
  }
  constructor(private element: ElementRef,
      private renderer: Renderer2,
      public readonly commonServices: CommonService,
      private shared:LocalStorageService,
      private router:Router,
  ) {}

  onClickProfile = () =>
  {
    const profileDropdownList = this.element.nativeElement.querySelector(
      '.profile-dropdown-list'
    );
    this.renderer.setAttribute(profileDropdownList, 'aria-expanded', 'true');
  };
  getUser()
  {
    this.dataUser= JSON.parse(this.shared.get('user')); 
  }
  theme=()=>{
    // this.isOpen = !this.isOpen;
    // this.shared.theme(this.isOpen);
    // if(this.isOpen){
    //   this.themeBackground = "bg-black text-white";
    // }else{
    //   this.themeBackground = "bg-white text-black"
    // }

  }
  getUserInitials(name:string)
  {
    const words = name.split(' ');
    const initials = words.map(word => word.charAt(0)).join('');
    return initials.toUpperCase();
  }
  deconnecter=()=>
  {
    this.shared.chargeLogout("oui");
    this.router.navigate([this.commonServices.prepareRoute(PublicRoutes.Signin)])
  }
}
