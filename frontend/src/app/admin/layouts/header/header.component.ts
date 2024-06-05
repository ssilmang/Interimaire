import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonService } from 'src/app/_core/services/common.service';
import { Images } from 'src/assets/data/images';
import { AdminRoutes, ElementRoutes, SettingRoutes } from '../../admin.routes';
import { AppRoutes } from 'src/app/app.routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public userOne: string = Images.users.userOne;
  readonly appRoutes = AppRoutes;
  readonly adminRoutes = AdminRoutes;
  readonly settingRoutes = SettingRoutes;
  readonly elementRoutes = ElementRoutes;
  isOpen: boolean = false;

  constructor(private element: ElementRef, private renderer: Renderer2,
    public readonly commonServices: CommonService,
  ) {}

  onClickProfile = () => {
    const profileDropdownList = this.element.nativeElement.querySelector(
      '.profile-dropdown-list'
    );
    this.renderer.setAttribute(profileDropdownList, 'aria-expanded', 'true');
  };
}
