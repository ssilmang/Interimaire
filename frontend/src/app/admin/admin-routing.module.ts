import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoutes, ElementRoutes, SettingRoutes } from './admin.routes';
import { AdminPageNotFoundComponent } from './views/admin-page-not-found/admin-page-not-found.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AdminAlertComponent } from './views/elements/alert/admin-alert.component';
import { ButtonsComponent } from './views/elements/buttons/buttons.component';
import { AdminDataTableComponent } from './views/elements/data-table/data-table.component';
import { FormsComponent } from './views/elements/forms/forms.component';
import { AdminModalComponent } from './views/elements/modal/admin-modal.component';
import { AdminTabComponent } from './views/elements/tab/admin-tab.component';
import { EventsComponent } from './views/events/events.component';
import { TestComponent } from './views/events/test/test.component';
import { ProfileComponent } from './views/settings/profile/profile.component';
import { UsersComponent } from './views/settings/users/users.component';

import { AdminDataPrestataireComponent } from './views/elements/data-prestataire/data-prestataire.component';
import { ImportExcelComponent } from './views/elements/import-excel/import-excel.component';
import { DashChartComponent } from './dash-chart/dash-chart.component';
import { DataRemplacerComponent } from '../shared/components/data-remplacer/data-remplacer.component';
import { ReportingRhComponent } from './views/reporting-rh/reporting-rh.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: AdminRoutes.Interimaire,
    pathMatch: 'full',
  },
  {
    title: 'Interimaire',
    path: AdminRoutes.Interimaire,
    component: DashboardComponent,
  },
  {
    title: 'dashboard',
    path: AdminRoutes.Dashboard,
    component: ReportingRhComponent,
  },
 
  {
    title: 'Events',
    path: AdminRoutes.Events,
    component: EventsComponent,
    children: [
      {
        path: 'testing',
        component: TestComponent,
        outlet: 'test',
      },
    ],
  },
  {
    title: 'Elements',
    path: AdminRoutes.Elements,
    children: [
      {
        title: 'Alert',
        path: ElementRoutes.Alert,
        component: AdminAlertComponent,
      },
      {
        path: 'tabs',
        component: AdminTabComponent,
      },
      {
        title: 'Modal',
        path: ElementRoutes.Modal,
        component: AdminModalComponent,
      },
      {
        title: 'Buttons',
        path: ElementRoutes.Buttons,
        component: ButtonsComponent,
      },
      {
        title: 'Data Table',
        path: ElementRoutes.DataTable,
        component: AdminDataTableComponent,
      },
      {
        title: 'Data Remplacer',
        path: ElementRoutes.DataRemplacer,
        component: DataRemplacerComponent,
      },
      {
        title: 'Data Prestataire',
        path: ElementRoutes.DataPrestataire,
        component: AdminDataPrestataireComponent,
      },
      {
        title: 'Forms',
        path: ElementRoutes.Forms,
        component: FormsComponent,
      },
      {
        title: 'Dashboard',
        path: ElementRoutes.Dashboard,
        component: DashChartComponent,
      },
      {
        title: 'Importer',
        path: ElementRoutes.Import,
        component: ImportExcelComponent,
      },
    ],
  },
  {
    path: AdminRoutes.Settings,
    children: [
      {
        title: 'Settings',
        path: SettingRoutes.Profile,
        component: ProfileComponent,
      },
      {
        title: 'Users',
        path: SettingRoutes.Users,
        component: UsersComponent,
      },
    ],
  },
  { path: '**', component: AdminPageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
