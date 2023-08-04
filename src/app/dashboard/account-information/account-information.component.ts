import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Store } from '@ngxs/store';
import { AccountInfoViewModel } from '../shared';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss'],
})
export class AccountInformationComponent implements OnInit {
  public accountInfo$: Observable<AccountInfoViewModel>;

  constructor(private _accountInfoService: ApiService, private _store: Store) {}

  public ngOnInit() {
    const userId = this._store.selectSnapshot(AuthState.getUserInfo).userId;
    this.accountInfo$ = this._accountInfoService.getUserInfo(userId).pipe();
  }
}
