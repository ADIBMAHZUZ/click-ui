import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { BatteryService } from './core/services/battery-service.service';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CoreState } from './core/store';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { withLatestFrom } from 'rxjs/operators';
import { Downloaded, DownloadType } from './shared/download';
import { ScreenOrientationService } from './shared/service/screen-orientation.service';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private _platform: Platform,
    private _translate: TranslateService,
    private _navigationBar: NavigationBar,
    private _screenOrientationService: ScreenOrientationService,
    private _batteryIsPlugged: BatteryService,
    private _store: Store,
    private _actions: Actions,
    private _statusBar: StatusBar,
    private _alertCtrl: AlertController,
    private _electron: ElectronService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this._platform.ready().then(async () => {
      try {
        const language = this._store.selectSnapshot(CoreState.getLanguage);
        this._translate.setDefaultLang(language ?? 'en');
        this._batteryIsPlugged.subscribe();
        if (Capacitor.isNativePlatform) {
          // await SplashScreen.hide();
          this._statusBar.hide();
        }
        if (!this._electron.isElectronApp) {
          this._screenOrientationService.disableRotate();
        }

        if (this._platform.is('android')) {
          this._navigationBar.setUp(true);
        }
        this.registerDownloadMedia();
      } catch (err) {
        console.warn(err);
      }
    });
  }

  private registerDownloadMedia() {
    this._actions
      .pipe(ofActionSuccessful(Downloaded), withLatestFrom(this._translate.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS')))
      .subscribe(([{ payload }, translation]: [Downloaded, any]) => {
        if (payload.downloadType === DownloadType.MEDIA) {
          const { BORROW_SUCCESSFULLY } = translation;
          this._alertCtrl
            .create({
              header: BORROW_SUCCESSFULLY.borrow_successfully,
              message: `${payload.mediaName}<br/>
                          ${BORROW_SUCCESSFULLY.borrow_is_successfully__have}`,
              cssClass: 'success-alert',
            })
            .then((warningAlert) => warningAlert.present());
        }
      });
  }
}
