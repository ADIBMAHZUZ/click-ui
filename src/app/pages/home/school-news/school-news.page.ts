import { Component, ViewChild } from '@angular/core';
import {} from '@angular/router';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { switchMap, tap, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { SchoolNewsViewModel } from 'src/app/core/models';
import { SchoolNewsBoardService } from './school-news.service';
import { Select, Store } from '@ngxs/store';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { AuthState } from 'src/app/auth/store/auth.state';
@Component({
  selector: 'app-school-news',
  templateUrl: './school-news.page.html',
  styleUrls: ['./school-news.page.scss'],
})
export class SchoolNewsPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private _ionContent: IonContent;

  public cachedSchoolNews: SchoolNewsViewModel;
  private _preLoadmoreUrl = '';
  private _schoolNews$: Observable<SchoolNewsViewModel>;
  private _subSink = new SubSink();
  private _preScrollY: number;

  constructor(
    private _schoolNewsBoardService: SchoolNewsBoardService,
    private _store: Store
  ) {}

  public ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    this._schoolNews$ = this.query$.pipe(
      switchMap((query) =>
        this._schoolNewsBoardService.getSchoolNewsBoard(query)
      ),
      tap((schoolNews) => {
        this.cachedSchoolNews = schoolNews;
      }),
      shareReplay({ refCount: true })
    );
    this._subSink.sink = this._schoolNews$.subscribe();
  }
  public ionViewDidEnter(): void {
    this._subSink.sink = this._schoolNews$.subscribe(() => {
      this._infiniteScroll.disabled = false;
    });
    if (this._preScrollY) {
      this._ionContent.scrollByPoint(0, this._preScrollY, 2000);
    }
  }
  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }

  public loadMore() {
    const nextUrl = this.cachedSchoolNews.next;
    if (nextUrl && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;
      this._subSink.sink = this._schoolNewsBoardService
        .getSchoolNewsBoardPage(nextUrl)
        .pipe(
          tap((schoolNews) => {
            schoolNews.results = this.cachedSchoolNews.results.concat(
              schoolNews.results
            );
            this.cachedSchoolNews = schoolNews;
          })
        )
        .subscribe();
    }

    this._infiniteScroll.complete();
    if (this.cachedSchoolNews.results.length == this.cachedSchoolNews.count) {
      this._infiniteScroll.disabled = true;
    }
  }

  getTitle(): string {
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    const language = this._store.selectSnapshot(CoreState.getLanguage);
    return language === 'ms'
      ? userInfo.library.schoolNewsBoardTitleMs
      : userInfo.library.schoolNewsBoardTitleEn;
  }
}
