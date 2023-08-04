import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreateNewModalComponent } from '../create-new-modal/create-new-modal.component';
import { ForgotPasswordResponse } from '../../models';
import { NetworkService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-check-token-modal',
  templateUrl: './check-token-modal.component.html',
  styleUrls: ['./check-token-modal.component.scss'],
})
export class CheckTokenModalComponent implements OnInit {
  form: FormGroup;
  response: ForgotPasswordResponse;
  message = 'LOGIN.FORGOT_PASSWORD.CHECK_TOKEN_MODAL.message';
  isSendingRequest = false;

  private _subSink = new SubSink();

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private networkService: NetworkService,
    private translateService: TranslateService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      token: [''],
    });
  }
  checkForgotPasswordToken() {
    const { token } = this.form.value;
    const tokenUppercase = token.toUpperCase();

    if (!this.isSendingRequest) {
      this.isSendingRequest = true;
      this._subSink.sink = this.authService
        .checkForgotPasswordToken({ token: tokenUppercase })
        .subscribe(async (response: ForgotPasswordResponse) => {
          this.response = response;
          if (response.success) {
            localStorage.setItem('token', tokenUppercase);
            await this.dismissModal();
            await this.openCreateNewModal();
          }
          this.isSendingRequest = false;
        });
    }
  }

  forgotPassword() {
    const forgotPasswordData = JSON.parse(
      localStorage.getItem('forgot_password_data')
    );
    if (this.networkService.isConnected()) {
      if (!this.isSendingRequest && forgotPasswordData) {
        this.isSendingRequest = true;
        this._subSink.sink = this.authService
          .forgotPassword(forgotPasswordData)
          .subscribe(async (response: ForgotPasswordResponse) => {
            this.response = response;
            if (response.success) {
              this.message =
                'LOGIN.FORGOT_PASSWORD.CHECK_TOKEN_MODAL.resend_message';
            }
            this.isSendingRequest = false;
          });
      }
    } else {
      this._subSink.sink = this.translateService
        .get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION')
        .subscribe((NO_INTERNET_CONNECTION) => {
          this.alertController
            .create({
              header: NO_INTERNET_CONNECTION.title,
              message: NO_INTERNET_CONNECTION.message,
              cssClass: 'warning-alert',
            })
            .then((warningAlert) => warningAlert.present());
        });
    }
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async openCreateNewModal() {
    const checkTokenModal = await this.modalController.create({
      component: CreateNewModalComponent,
      backdropDismiss: false,
      cssClass: 'small-modal',
    });
    await checkTokenModal.present();
  }
}
