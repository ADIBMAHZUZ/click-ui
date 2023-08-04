import { Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Logout } from 'src/app/auth/store/auth.actions';
import { ChangePasswordViewModel } from '../shared';
import { ApiService } from '../shared/services/api.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnDestroy {
  private _changePassword: Observable<ChangePasswordViewModel>;
  private _subSink = new SubSink();

  public isActive1: boolean;
  public isActive2: boolean;
  public isActive3: boolean;

  constructor(
    private _changePasswordService: ApiService,
    private _alertController: AlertController,
    private _translate: TranslateService,
    private _store: Store
  ) {}

  ngOnDestroy(): void {
    this._subSink.unsubscribe();
  }

  public async changePassword(currentPassword, newPassword, confirmPassword) {
    const translation = await this._translate
      .get('DASHBOARD.CHANGE_PASSWORD')
      .toPromise();

    this._changePassword = this._changePasswordService.changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    this._subSink.sink = this._changePassword.subscribe((data) => {
      if (data.success) {
        this.notifySuccess();
      } else {
        const error = data.error;
        if (error == 'New password must be at least 6 characters') {
          this.notifyError(translation.new_password_must_be_at_least);
        } else if (error == 'Current Password is incorrect') {
          this.notifyError(translation.current_password_is_incorrect);
        } else if (error == 'New password and confirm password are not match') {
          this.notifyError(translation.new_password_and_confirm);
        }
      }
    });
  }

  public showPassword1() {
    this.isActive1 = !this.isActive1;
  }
  public showPassword2() {
    this.isActive2 = !this.isActive2;
  }
  public showPassword3() {
    this.isActive3 = !this.isActive3;
  }

  public async notifyError(errorMess: string) {
    const translation = await this._translate
      .get('DASHBOARD.CHANGE_PASSWORD')
      .toPromise();
    const warningAlert = await this._alertController.create({
      header: translation.fail,
      message: errorMess,
      cssClass: 'warning-alert',
    });
    await warningAlert.present();
  }

  public async notifySuccess() {
    const translation = await this._translate
      .get('DASHBOARD.CHANGE_PASSWORD')
      .toPromise();
    const buttons = [
      {
        text: translation.log_out,
        handler: () => this._logoutHandler(),
      },
    ];
    const warningAlert = await this._alertController.create({
      header: translation.success,
      message: translation.change_password_success,
      cssClass: 'warning-alert',
      buttons,
    });
    await warningAlert.present();
  }

  private _logoutHandler(): void {
    this._store.dispatch(new Logout());
  }
}
