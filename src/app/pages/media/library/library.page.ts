import { Component } from '@angular/core';
import { NavController, IonTabs } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from 'src/app/core/store';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage {
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;
  private activeTab?: HTMLElement;

  constructor(private _navCtrl: NavController) {}

  clickTab(event: Event, tab: string) {
    event.stopImmediatePropagation();

    this._navCtrl.navigateRoot([`/media/library/${tab}`]);
  }
  tabChange(tabsRef: IonTabs) {
    this.activeTab = (tabsRef.outlet as any).activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }
}
