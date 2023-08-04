import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class BatteryService {
  private _preIsPlugged = false;

  constructor(private _batteryStatus: BatteryStatus, private _translate: TranslateService, private _alertCtrl: AlertController) {}

  subscribe() {
    this._batteryStatus.onChange().subscribe(async (status) => {
      if (!this._preIsPlugged && status.isPlugged) {
        const PLUG_ALERT = await this._translate.get('APP.ALERTS.PLUG_ALERT').toPromise();
        const warningAlert = await this._alertCtrl.create({
          header: PLUG_ALERT.title,
          message: PLUG_ALERT.message,
          cssClass: 'warning-alert',
        });
        await warningAlert.present();
      }
      this._preIsPlugged = status.isPlugged;
    });
  }
}
