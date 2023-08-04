import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarItem } from './sidebar-item.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';
import { SubSink } from 'subsink';
import { Store } from '@ngxs/store';
import { Logout } from 'src/app/auth/store/auth.actions';
import { CoreState } from '../../store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { LoginViewModel } from 'src/app/auth/shared/models';
import { DownloadingService } from 'src/app/teacher-notes/shared/services/downloading.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  language: string;
  userInfo: LoginViewModel;
  selectedPath = '';

  sidebarItems: SidebarItem[] = [
    {
      title: 'media',
      icon: 'assets/icons/home/library.svg',
      url: '/home/library',
    },
    {
      title: 'schoolNewsBoard',
      icon: 'assets/icons/home/school-news.svg',
      url: '/home/school-news',
    },
    {
      title: 'teacherNotes',
      icon: 'assets/icons/home/teacher-notes.svg',
      url: '/home/teacher-notes',
    },
    {
      title: 'learningMaterial',
      icon: 'assets/icons/home/material.svg',
      url: '/home/material',
    },
    {
      title: 'theSchoolHistory',
      icon: 'assets/icons/home/school-history.svg',
      url: '/home/school-history',
    },
    {
      title: 'studentContent',
      icon: 'assets/icons/home/student-content.svg',
      url: '/home/student-content',
    },
  ];
  private _subSink = new SubSink();

  constructor(
    private _alertController: AlertController,
    private _translate: TranslateService,
    private _navCtrl: NavController,
    private _store: Store,
    private _downloadingService: DownloadingService
  ) {}

  ngOnInit() {
    this.userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    this.language = this._store.selectSnapshot(CoreState.getLanguage);
    this.selectedPath = this.sidebarItems.find((item) => {
      const mediaUrl = location.pathname.replace('/media/', '/home/');
      return location.pathname.startsWith(item.url) || mediaUrl.startsWith(item.url);
    })?.url;
  }
  ngOnDestroy(): void {
    this._subSink.unsubscribe();
  }
  async logout() {
    const translation = await this._translate.get('NAVBAR.ALERT').toPromise();
    const buttons = [
      {
        text: translation.ok,
        handler: () => {
          this._downloadingService.clearAll();
          this._store.dispatch(new Logout());
        },
      },
      {
        text: translation.cancel,
        role: translation.cancel,
        cssClass: 'secondary',
      },
    ];
    const warningAlert = await this._alertController.create({
      header: translation.logout,
      message: translation.message,
      cssClass: 'warning-alert',
      buttons,
    });
    await warningAlert.present();
  }

  navigateTo(url: string) {
    this._navCtrl.navigateRoot(url);
  }

  isAtHome() {
    return location.pathname === '/home' || location.pathname === '/home/';
  }
}
