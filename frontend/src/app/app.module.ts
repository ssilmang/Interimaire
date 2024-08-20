import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {AdminModule} from './admin/admin.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {PublicModule} from './public/public.module';

import {httpInterceptorProviders} from './_core/interceptors/interceptors.provider';
import {StrategyProviders} from "./_core/strategies/strategy.providers";
import {UtilsProviders} from "./shared/utils/utils.providers";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        AppRoutingModule,
        AdminModule,
        PublicModule,
        LoadingBarRouterModule,
        LoadingBarModule,
        NgxChartsModule
    ], providers: [
        httpInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
    ] })
export class AppModule { }
