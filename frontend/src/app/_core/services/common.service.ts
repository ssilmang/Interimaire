import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
  
export class CommonService {
  constructor() { }

  public prepareRoute(...paths: string[]): string{
    let rootRoute = '/';
    return rootRoute.concat(paths.filter(Boolean).join('/'));
  }
  public prepareRouteId( Id: number,...paths: string[]): string {
    let route = `/${paths.filter(Boolean).join('/')}`;
  if (Id !== undefined) {
    route =route.replace(/\/:id/,`/${Id}`);
  }
  return route;
  }
}
