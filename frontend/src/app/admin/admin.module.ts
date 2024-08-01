import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutsModule } from './layouts/layouts.module';

import { AdminComponent } from './admin.component';
import { AdminPageNotFoundComponent } from './views/admin-page-not-found/admin-page-not-found.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EventsComponent } from './views/events/events.component';
import { SettingsModule } from './views/settings/settings.module';
import { ElementsModule } from './views/elements/elements.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AdminComponent,
    // DashboardComponent,
    AdminPageNotFoundComponent,
    EventsComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutsModule,
    SettingsModule,
    ElementsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminModule { }
