import { AfterViewInit, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { LocalStorageService } from '../shared/services/localStorage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements AfterViewInit{
  title = 'event-bud-frontend';
  background:string = "";
  backgroundHeder:string="";
  backgroundMain:string = "";

  constructor(private element: ElementRef, private rendered: Renderer2, private shared:LocalStorageService) { }

  @HostListener('click', ['$event.target']) onClick(e: Element) {
    const profileDropdown = this.element.nativeElement.querySelector('.profile-dropdown') as Element;
    if (!profileDropdown.contains(e)) {
      const profileDropdownList = this.element.nativeElement.querySelector('.profile-dropdown-list');
      this.rendered.setAttribute(profileDropdownList, 'aria-expanded', 'false');
    }
  }
  ngAfterViewInit(): void
  {
    this.shared.currentTheme.pipe().subscribe(theme=>{
      if(theme){
        this.background = "@apply sticky top-0 px-3 bg-white min-h-screen pt-5 transition-all duration-300 text-black";
        this.backgroundHeder = "@apply strick top-0 px-3 bg-black min-h-screen pt-5 transition-all duration-300 text-black";
        this.backgroundMain = "bg-gray-900";
      }else{
        this.background = "@apply sticky top-0 px-3 bg-slate-900 min-h-screen pt-5 transition-all duration-300";
        this.backgroundMain = "bg-gray-200";
      }
    })
  }

}
