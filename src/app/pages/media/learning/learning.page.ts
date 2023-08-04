import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from 'src/app/core/store';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.page.html',
  styleUrls: ['./learning.page.scss'],
})
export class LearningPage {
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;
  private activeTab?: HTMLElement;

  constructor(private router: Router) {}

  clickTab(event: Event, tab: string) {
    event.stopImmediatePropagation();

    this.router.navigate([`/media/material/${tab}`]);
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
