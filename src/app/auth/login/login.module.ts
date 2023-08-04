import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { ForgotPasswordModalComponent } from '../shared/components/forgot-password-modal/forgot-password-modal.component';
import { CheckTokenModalComponent } from '../shared/components/check-token-modal/check-token-modal.component';
import { CreateNewModalComponent } from '../shared/components/create-new-modal/create-new-modal.component';
import { SharedComponentsModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    LoginPage,
    ForgotPasswordModalComponent,
    CheckTokenModalComponent,
    CreateNewModalComponent,
  ],
})
export class LoginPageModule {}
