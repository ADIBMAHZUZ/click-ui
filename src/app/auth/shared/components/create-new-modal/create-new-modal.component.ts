import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { ForgotPasswordResponse } from '../../models';
import { NetworkService } from 'src/app/core/services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-create-new-modal',
  templateUrl: './create-new-modal.component.html',
  styleUrls: ['./create-new-modal.component.scss'],
})
export class CreateNewModalComponent implements OnInit {
  form: FormGroup;
  response: ForgotPasswordResponse;
  translatedAlertInfor: { title: string; message: string };
  isSendingRequest = false;

  private _subSink = new SubSink();

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private networkService: NetworkService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.translateService
      .get('LOGIN.FORGOT_PASSWORD.CREATE_NEW_TOKEN.ALERT')
      .subscribe((translation) => {
        this.translatedAlertInfor = translation;
      });
  }

  createNewPassword() {
    const token = localStorage.getItem('token');
    const { new_password, confirm_password } = this.form.value;
    if (this.networkService.isConnected()) {
      if (this.form.valid && !this.isSendingRequest) {
        this.isSendingRequest = true;
        this._subSink.sink = this.authService
          .createNewPassword({ token, new_password, confirm_password })
          .subscribe(async (response: ForgotPasswordResponse) => {
            this.response = response;
            if (response.success) {
              await this.dismissModal();

              const alert = await this.alertController.create({
                header: this.translatedAlertInfor.title,
                message: this.translatedAlertInfor.message,
                cssClass: 'success-alert',
              });

              await alert.present();
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
  clearResponse() {
    this.response = null;
  }
}
