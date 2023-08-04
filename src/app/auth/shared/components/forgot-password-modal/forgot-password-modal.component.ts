import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CheckTokenModalComponent } from '../check-token-modal/check-token-modal.component';
import { ForgotPasswordResponse } from '../../models';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NetworkService } from 'src/app/core/services';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent implements OnInit {
  form: FormGroup;
  response: ForgotPasswordResponse;
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
      username: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
          ),
          Validators.required,
        ]),
      ],
    });
  }
  forgotPassword() {
    if (this.networkService.isConnected()) {
      if (this.form.valid && !this.isSendingRequest) {
        this.isSendingRequest = true;
        const { username, email } = this.form.value;
        this._subSink.sink = this.authService
          .forgotPassword({ username, email })
          .subscribe(async (response: ForgotPasswordResponse) => {
            this.response = response;
            if (response.success) {
              localStorage.setItem(
                'forgot_password_data',
                JSON.stringify({ username, email })
              );
              await this.dismissModal();
              await this.openCheckTokenModal();
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
  async openCheckTokenModal() {
    const checkTokenModal = await this.modalController.create({
      component: CheckTokenModalComponent,
      backdropDismiss: false,
      cssClass: 'small-modal',
    });
    await checkTokenModal.present();
  }
  clearResponse() {
    this.response = null;
  }
}
