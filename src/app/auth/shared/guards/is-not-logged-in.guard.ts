import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthState } from '../../store/auth.state';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class IsNotLoggedInGuard implements CanActivate {
  constructor(private router: Router, private _store: Store) {}

  async canActivate() {
    const isNotLogined = !this._store.selectSnapshot(AuthState.getToken);
    if (!isNotLogined) {
      this.router.navigateByUrl('/home');
    }
    return isNotLogined;
  }
}
