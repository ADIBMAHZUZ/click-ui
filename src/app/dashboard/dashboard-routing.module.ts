import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: 'account-info',
    component: AccountInformationComponent,
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
