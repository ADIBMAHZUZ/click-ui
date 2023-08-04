import { Injectable } from '@angular/core';
import { CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { NetworkService } from '../services/network.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

const enum HomeUrlPrefix {
  LIBRARY = 'library',
  SCHOOL_NEWS = 'school-news',
  TEACHER_NOTES = 'teacher-notes',
  MATERIAL = 'material',
  SCHOOL_HISTORY = 'school-history',
  STUDENT_CONTENT = 'student-content',
}

@Injectable({ providedIn: 'root' })
export class OfflineHomeGuard implements CanActivateChild {
  constructor(
    private _navCtrl: NavController,
    private _network: NetworkService,
    private _translateService: TranslateService,
    private _alertCtrl: AlertController,
    private _platform: Platform
  ) {}

  async canActivateChild(_, state: RouterStateSnapshot) {
    await this._platform.ready();

    const url = state.url;
    if (url === '/home/' || url === '/home') {
      return true;
    }
    if (!this._network.isConnected()) {
      const urlWithoutHome = url.replace('/home/', '');
      const destination = urlWithoutHome.substring(
        0,
        urlWithoutHome.indexOf('/') > -1
          ? urlWithoutHome.indexOf('/')
          : urlWithoutHome.length
      );
      if (
        urlWithoutHome.startsWith(HomeUrlPrefix.SCHOOL_NEWS) ||
        urlWithoutHome.startsWith(HomeUrlPrefix.SCHOOL_HISTORY) ||
        urlWithoutHome.startsWith(HomeUrlPrefix.STUDENT_CONTENT)
      ) {
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

      this._navCtrl.navigateRoot(`/media/${destination}`);
    }
    return true;
  }
}
