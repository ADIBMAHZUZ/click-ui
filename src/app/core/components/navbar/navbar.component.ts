import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select, Actions, ofActionCompleted } from '@ngxs/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { CoreState, SetNavbarVisibility, SetTabbarVisibility, UpdateSearchQuery } from '../../store';
import { NavController, Platform } from '@ionic/angular';
import { UpdateProfile } from 'src/app/auth/store/auth.actions';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;
  @Select(CoreState.isNavbarVisible) isNavbarVisible$: Observable<boolean>;
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;
  navigationEndUrl$: Observable<string>;

  appName = 'Cloud Library Information Center';
  avatar = 'assets/images/avatar.png';
  dropdownMenuSelected = false;
  dropdownProfileSelected = false;
  greeting = 'Hi, ______';
  logo = 'assets/images/school-logo.png';
  schoolName = 'Sekolah Aminuddin Baki Kuala Lumpur';
  isShowSearchInput = false;
  isNavBarVisible$: Observable<boolean>;

  pathName: string;

  private _preQuery: string;

  constructor(
    private _store: Store,
    private _platform: Platform,
    private _actions: Actions,
    private _router: Router,
    private _navCtrl: NavController,
    private _electron: ElectronService
  ) {}

  ngOnInit() {
    this._updateContent();
    this.pathName = location.pathname;
    this._actions.pipe(ofActionCompleted(UpdateProfile)).subscribe(() => {
      this._updateContent();
    });

    this.navigationEndUrl$ = this._router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    );
  }
  ngOnDestroy(): void {}
  onSearchChange(event: CustomEvent) {
    const { value } = event.detail;
    if (this._preQuery === value) {
      return;
    }
    this._preQuery = value;
    this._store.dispatch(new UpdateSearchQuery({ query: value }));
  }
  closeDashBoard(event) {
    this.dropdownProfileSelected = false;
    event.preventDefault();
    event.stopPropagation();
  }

  closeMenu(event) {
    this.dropdownMenuSelected = false;
    event.preventDefault();
    event.stopPropagation();
  }
  openDashBoard() {
    this.dropdownProfileSelected = true;
  }

  openMenu() {
    this.dropdownMenuSelected = true;
  }

  openFullSearchbar() {
    this.isShowSearchInput = true;
  }

  hideFullSearchbar() {
    this.isShowSearchInput = false;
  }
  private async _updateContent() {
    await this._platform.ready();
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    this.greeting = `Hi, ${userInfo?.name}`;
    this.schoolName = userInfo?.library.name;
    if (userInfo?.library.logo) {
      this.logo = userInfo?.library.logo;
    }
    if (userInfo?.logo) {
      this.avatar = userInfo?.logo;
    }
  }

  goTo(url: string) {
    this._store.dispatch([new SetNavbarVisibility(true), new SetTabbarVisibility(true)]);
    this._navCtrl.navigateRoot(url);
  }
}
