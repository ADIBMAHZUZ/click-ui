import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaType } from 'src/app/core/models/others';
import { formatDate } from '@angular/common';
import { OptionsTypeItem, ActivityDetailViewModel, ActivityAction, ActivityCategories } from '../shared';
import { ApiService } from '../shared/services/api.service';
import { IonSelect, PopoverController } from '@ionic/angular';
import { ActivityPopupComponent } from '../activity-popup/activity-popup.component';
const optionsType = [
  {
    name: 'HOME.LIBRARY.MEDIA.book',
    value: MediaType.BOOK,
  },
  {
    name: 'HOME.LIBRARY.MEDIA.audio',
    value: MediaType.AUDIO,
  },
  {
    name: 'HOME.LIBRARY.MEDIA.video',
    value: MediaType.VIDEO,
  },
];

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent {
  public optionsType: OptionsTypeItem[] = optionsType;

  public activities$: Observable<ActivityDetailViewModel>;
  public categories$: Observable<ActivityCategories>;

  // Get current date
  public today = new Date();

  // searching field
  public category: string = null;
  public mediaType: MediaType = null;
  public from = new Date().toISOString();
  public to = new Date().toISOString();
  public isShowFilters = false;

  constructor(private _activitiesService: ApiService, private _popupCtrl: PopoverController) {}

  public ionViewWillEnter() {
    this.activities$ = this._activitiesService.getDetails(this.formatDate(this.from), this.formatDate(this.to));
    this.categories$ = this._activitiesService.getCategories();
  }

  updateCategoriesAndLoadData(from: string, to: string, categorySelect?: IonSelect, mediaType?: string) {
    categorySelect.value = 'all';
    if (mediaType === 'all') {
      this.categories$ = this._activitiesService.getCategories();
    } else {
      this.categories$ = this._activitiesService.getCategories(mediaType as MediaType);
    }
    this.loadData(from, to, categorySelect.value, mediaType);
  }
  loadData(from: string, to: string, categoryAsString?: string, mediaTypeAsString?: string) {
    const mediaType = mediaTypeAsString === 'all' ? null : (mediaTypeAsString as MediaType);
    const category = categoryAsString === 'all' ? null : categoryAsString;
    this.activities$ = this._activitiesService.getDetails(this.formatDate(from), this.formatDate(to), category, mediaType as MediaType);
  }

  getBackgroundColor(action: ActivityAction) {
    switch (action) {
      case 'borrow':
        return 'success';
      case 'return':
        return 'danger';
      case 'extend':
        return 'primary';
    }
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }
    return formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
  }
  toggleFilters() {
    this.isShowFilters = !this.isShowFilters;
  }

  async openPopup(date: string, media: string, action: string) {
    const popover = await this._popupCtrl.create({
      component: ActivityPopupComponent,
      translucent: true,
      componentProps: { date, mediaName: media, action },
    });
    return await popover.present();
  }
}
