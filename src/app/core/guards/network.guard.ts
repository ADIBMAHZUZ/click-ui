import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { NetworkService } from '../services/network.service';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class NetworkGuard implements CanActivateChild {
  constructor(
    private _network: NetworkService,
    private _translateService: TranslateService,
    private _alertCtrl: AlertController,
    private _platform: Platform
  ) {}

  async canActivateChild() {
    await this._platform.ready();
    if (!this._network.isConnected()) {
      const NO_INTERNET_CONNECTION: any = await this._translateService
        .get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION')
        .toPromise();

      const warningAlert = await this._alertCtrl.create({
        header: NO_INTERNET_CONNECTION.title,
        message: NO_INTERNET_CONNECTION.message,
        cssClass: 'warning-alert',
      });
      await warningAlert.present();

      return false;
    }
    return true;
  }
}
