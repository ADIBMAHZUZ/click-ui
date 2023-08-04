import { Injectable } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth.state';

@Injectable({ providedIn: 'root' })
export class IsLoggedInGuard implements CanActivateChild {
  constructor(private router: Router, private _store: Store) {}

  async canActivateChild() {
    const isLogined = !!this._store.selectSnapshot(AuthState.getToken);
    if (!isLogined) {
      this.router.navigateByUrl('/login');
    }
    return isLogined;
  }
}
