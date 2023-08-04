import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileItem } from './profile-item.model';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { DashboardInfoService } from './profile.service';
import { NetworkService } from '../../services/network.service';
import { SubSink } from 'subsink';
import { DashboardViewModel } from 'src/app/dashboard/shared';
import { LoginViewModel } from 'src/app/auth/shared/models';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public profileItems: ProfileItem[] = [
    {
      title: 'DASHBOARD.account_information',
      url: '/dashboard/account-info',
    },
    {
      title: 'DASHBOARD.change_password',
      url: '/dashboard/change-password',
    },
    {
      title: 'DASHBOARD.activities',
      url: '/dashboard/activities',
    },
  ];
  public selectedPath = '';

  public userInfo: LoginViewModel;
  public avatar = 'assets/images/avatar.png';
  public cachedDashboard: DashboardViewModel;

  private _subSink = new SubSink();

  constructor(
    private navCtrl: NavController,
    private _dashboardInfoService: DashboardInfoService,
    private _store: Store,
    private _network: NetworkService
  ) {
    this.selectedPath = this.profileItems.find((item) =>
      location.pathname.startsWith(item.url)
    )?.url;
  }

  ngOnInit() {
    this.userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    if (this._network.isConnected()) {
      this._subSink.sink = this._dashboardInfoService
        .getDashboardInfo()
        .subscribe((info) => {
          this.cachedDashboard = info;
        });
    }
  }

  ngOnDestroy(): void {
    this._subSink.unsubscribe();
  }

  navigateTo(url: string) {
    this.navCtrl.navigateRoot(url);
  }
}
