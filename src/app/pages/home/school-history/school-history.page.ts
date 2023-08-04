import { Component, ViewChild } from '@angular/core';
import { SchoolHistoryService } from './school-history.service';
import { SchoolHistoryViewModel } from 'src/app/core/models';
import { SubSink } from 'subsink';
import { switchMap, tap } from 'rxjs/operators';
import { ResetSearchQuery, CoreState } from 'src/app/core/store';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/store/auth.state';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-school-history',
  templateUrl: './school-history.page.html',
  styleUrls: ['./school-history.page.scss'],
})
export class SchoolHistoryPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;

  public schoolHistory: SchoolHistoryViewModel;
  private _subSink = new SubSink();
  private _preLoadmoreUrl: string;

  constructor(
    private schoolHistoryService: SchoolHistoryService,
    private _store: Store
  ) {}

  public ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    this._subSink.sink = this.query$
      .pipe(
        switchMap((query) => this.schoolHistoryService.getSchoolHistory(query)),
        tap((schoolHistory) => (this.schoolHistory = schoolHistory))
      )
      .subscribe();
  }

  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }
  getTitle(): string {
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    const language = this._store.selectSnapshot(CoreState.getLanguage);
    return language === 'ms'
      ? userInfo?.library?.theSchoolHistoryTitleMs
      : userInfo?.library?.theSchoolHistoryTitleEn;
  }

  public loadMore() {
    const nextUrl = this.schoolHistory.next;
    if (nextUrl && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;
      this._subSink.sink = this.schoolHistoryService
        .getSchoolHistoryNext(nextUrl)
        .pipe(
          tap((schoolHistory) => {
            schoolHistory.results = this.schoolHistory.results.concat(
              schoolHistory.results
            );
            this.schoolHistory = schoolHistory;
          })
        )
        .subscribe();
    }

    this._infiniteScroll.complete();
    if (this.schoolHistory.results.length == this.schoolHistory.count) {
      this._infiniteScroll.disabled = true;
    }
  }
}
