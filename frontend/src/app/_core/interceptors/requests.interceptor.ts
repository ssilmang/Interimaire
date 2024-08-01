import {Injectable, inject} from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import {LocalStorageService} from "../../shared/services/localStorage.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";


@Injectable()
export class RequestsInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const requestUrl: string =  request.url;
        const accessToken: string = this.localStorageService.get("token");

        if(accessToken) {
            request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
            });
        }

        request = request.clone({ url: requestUrl });

        return next.handle(request);
    }
}
