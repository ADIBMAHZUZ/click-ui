import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SetNavbarVisibility, SetTabbarVisibility } from '../../store';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  navigationEndUrl$: Observable<string>;
  isShowFooter: boolean;

  constructor(private _store: Store, private _router: Router, private _navCtrl: NavController, public platform: Platform) {}

  ngOnInit(): void {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.isShowFooter = true;
    }
    if (this.platform.is('tablet') || this.platform.is('ipad')) {
      this.isShowFooter = false;
    }
    this.navigationEndUrl$ = this._router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    );
  }

  goTo(url: string) {
    this._store.dispatch([new SetNavbarVisibility(true), new SetTabbarVisibility(true)]);
    // this._router.navigateByUrl(url);
    this._navCtrl.navigateRoot(url);
  }
}
