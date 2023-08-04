import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CoreState } from 'src/app/core/store';
import { Select, Store } from '@ngxs/store';
import { LoginViewModel } from 'src/app/auth/shared/models';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;
  language: string;
  userInfo: LoginViewModel;

  constructor(private _navCtrl: NavController, private _store: Store) {}

  clickTab(event: Event, tab: string) {
    event.stopImmediatePropagation();
    this._navCtrl.navigateRoot([`/media/${tab}/`]);
  }

  ngOnInit() {
    this.userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    this.language = this._store.selectSnapshot(CoreState.getLanguage);
  }
}
