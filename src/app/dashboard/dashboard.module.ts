import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { SharedComponentsModule } from 'src/app/shared/shared.module';
import { ActivitiesComponent } from './activities/activities.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ActivityPopupComponent } from './activity-popup/activity-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [
    ActivitiesComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
    ActivityPopupComponent,
  ],
})
export class DashboardPageModule {}
