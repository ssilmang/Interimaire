import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_core/services/common.service';
import { AppRoutes } from 'src/app/app.routes';
import { AdminRoutes, ElementData, ElementRoutes, SettingRoutes } from '../../admin.routes';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { PublicRoutes } from 'src/app/public/public.routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  sidebarIsCollapsed: boolean = true;
  readonly appRoutes = AppRoutes;
  readonly adminRoutes = AdminRoutes;
  readonly settingRoutes = SettingRoutes;
  readonly elementRoutes = ElementRoutes;
  readonly element = ElementData;
  private routerSubscription: Subscription = new Subscription();
  @Input() background:string ="";
  @Output() sidebarCollapsed = new EventEmitter<boolean>();

  constructor(
    public readonly commonServices: CommonService,
    private readonly elementRef: ElementRef,
    private shared:LocalStorageService,
    private router: Router) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.subMenuToggleHandlerOnRouteChange();
    setTimeout(() => { this.subMenuToggleHandlerOnPageReload() }, 1);
  }
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
  subMenuToggleHandler = (event: MouseEvent): void => {
    const elem = event.target as HTMLElement;
    const subMenu = elem.closest("a.sub-menu") as Element;

    if (subMenu.getAttribute('aria-expanded') == 'false')
      subMenu.setAttribute('aria-expanded', 'true');
    else
      subMenu.setAttribute('aria-expanded', 'false');
  }
  subMenuToggleHandlerOnPageReload = (): void => {
    const elem = this.elementRef.nativeElement.querySelector('[aria-current="page"]')
      .closest('ul.sub-menu-item') as Element;
    const subMenu = elem?.previousSibling as Element;
    subMenu?.setAttribute('aria-expanded', 'true');
  }
  subMenuToggleHandlerOnRouteChange = (): void => {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const subMenu = this.elementRef.nativeElement.querySelectorAll(".sub-menu");
        const elem = this.elementRef.nativeElement.querySelector(`[href='${event.url}']`) as Element;
        if (elem.closest('ul.sub-menu-item')) return;
        subMenu.forEach((subMenu: Element) => {
          if (subMenu.getAttribute('aria-expanded') == 'true')
            subMenu.setAttribute('aria-expanded', 'false');
        });
      }
    })
  }
  deconnecter=()=>{
    this.shared.chargeLogout("oui")
    this.router.navigate([this.commonServices.prepareRoute(PublicRoutes.Signin)]);
  }
  // get encodedRoute() {
    
  //   const encodedId = btoa(this.id.toString()); // Encode en base64
  //   return this.commonService.prepareRouteId(encodedId, appRoutes.Admin, adminRoutes.Elements, elementRoutes.DataTable);
  // }
}
