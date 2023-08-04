import { ElectronService } from 'ngx-electron';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, AlertController, ToastController } from '@ionic/angular';
import { SubSink } from 'subsink';
import { switchMapTo, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordModalComponent } from '../shared/components';
import { NetworkService } from 'src/app/core/services';
import { Store, Actions, ofActionCompleted } from '@ngxs/store';
import { Login } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';
import { DownloadAllNotes } from 'src/app/teacher-notes/store';
import { DownloadAllMaterials } from 'src/app/pages/home/material/store';
import { DownloadAllMedias } from 'src/app/pages/home/library/store';
import { CreateFolders } from 'src/app/shared/download';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isSubmitted = false;
  checkPass = true;
  loginForm: FormGroup;
  isKeyboardShow = false;

  private _subSink = new SubSink();
  private _keyboardWillShowHandler: PluginListenerHandle;
  private _keyboardWillHideHandler: PluginListenerHandle;
  private _toast: HTMLIonToastElement;

  constructor(
    private _formBuilder: FormBuilder,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
    private _translateService: TranslateService,
    private _modalCtrl: ModalController,
    private _networkService: NetworkService,
    private _store: Store,
    private _actions: Actions,
    private _toastCtrl: ToastController,
    private _electron: ElectronService
  ) {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this._store.selectSnapshot(AuthState.getToken)) {
      this._navCtrl.navigateRoot('/home');
      return;
    }

    this._subSink.sink = this._actions
      .pipe(
        ofActionCompleted(Login),
        switchMapTo(this._store.select(AuthState.getToken)),
        tap((tokenInStore) => {
          if (tokenInStore) {
            document.body.style.marginTop = '0px';
            this.isSubmitted = false;
            this._loadDownladedItems();
            this._store.dispatch(new CreateFolders());
            this._navCtrl.navigateRoot('/home');
          }
        })
      )
      .subscribe();

    this.clearForm();
  }

  async openForgotPasswordModal(): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: ForgotPasswordModalComponent,
      swipeToClose: true,
      cssClass: 'small-modal',
    });
    await modal.present();
  }

  clearForm() {
    this.form.username.reset();
    this.form.password.reset();
  }

  get form() {
    return this.loginForm.controls;
  }

  async onLogin() {
    if (!this._networkService.isConnected()) {
      const NO_INTERNET_CONNECTION = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION').toPromise();
      const warningAlert = await this._alertCtrl.create({
        header: NO_INTERNET_CONNECTION.title,
        message: NO_INTERNET_CONNECTION.message,
        cssClass: 'warning-alert',
      });
      await warningAlert.present();
      return;
    }
    const { username, password } = this.loginForm.value;
    if (username && password) {
      this._store.dispatch(new Login({ username, password }));
    } else {
      if (this._toast) {
        this._toast.dismiss();
      }
      const message = await this._translateService.get('LOGIN.CLICk400.message').toPromise();
      this._toast = await this._toastCtrl.create({
        message,
        duration: 3000,
        position: 'bottom',
      });
      this._toast.present();
    }
  }

  private _loadDownladedItems() {
    if (Capacitor.isNativePlatform) {
      this._store.dispatch(new DownloadAllMaterials());
      this._store.dispatch(new DownloadAllNotes());
      this._store.dispatch(new DownloadAllMedias());
    }
  }

  ngOnDestroy(): void {
    if (!this._electron.isElectronApp) {
      this._keyboardWillShowHandler.remove();
      this._keyboardWillHideHandler.remove();
    }
    this._subSink.unsubscribe();
  }

  showKeyBoard() {
    this.isKeyboardShow = true;
    document.querySelector('.small-modal')?.classList.add('keyboard-up');
  }

  hideKeyBoard() {
    this.isKeyboardShow = false;
    document.querySelector('.small-modal')?.classList.remove('keyboard-up');
  }
}
