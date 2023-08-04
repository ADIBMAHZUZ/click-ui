import { Component, ViewChild } from '@angular/core';
import {} from '@angular/router';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { switchMap, tap, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { StudentContentViewModel } from 'src/app/core/models';
import { StudentContentService } from './student-content.service';
import { Store, Select } from '@ngxs/store';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { AuthState } from 'src/app/auth/store/auth.state';
@Component({
  selector: 'app-student-content',
  templateUrl: './student-content.page.html',
  styleUrls: ['./student-content.page.scss'],
})
export class StudentContentPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private _ionContent: IonContent;

  public cachedStudentContent: StudentContentViewModel;
  private _preLoadmoreUrl = '';
  private _studentContent$: Observable<StudentContentViewModel>;
  private _subSink = new SubSink();
  private _preScrollY: number;

  constructor(
    private _studentContentService: StudentContentService,
    private _store: Store
  ) {}

  public ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    this._studentContent$ = this.query$.pipe(
      switchMap((query) =>
        this._studentContentService.getStudentContent(query)
      ),
      tap((schoolNews) => {
        this.cachedStudentContent = schoolNews;
      }),
      shareReplay({ refCount: true })
    );
    this._subSink.sink = this._studentContent$.subscribe();
  }
  public ionViewDidEnter(): void {
    this._subSink.sink = this._studentContent$.subscribe(() => {
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
    const nextUrl = this.cachedStudentContent.next;
    if (nextUrl && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;
      this._subSink.sink = this._studentContentService
        .getStudentContentPage(nextUrl)
        .pipe(
          tap((schoolNews) => {
            schoolNews.results = this.cachedStudentContent.results.concat(
              schoolNews.results
            );
            this.cachedStudentContent = schoolNews;
          })
        )
        .subscribe();
    }

    this._infiniteScroll.complete();
    if (
      this.cachedStudentContent.results.length ==
      this.cachedStudentContent.count
    ) {
      this._infiniteScroll.disabled = true;
    }
  }
  getTitle(): string {
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    const language = this._store.selectSnapshot(CoreState.getLanguage);
    return language === 'ms'
      ? userInfo?.library?.studentContentTitleMs
      : userInfo?.library?.studentContentTitleEn;
  }
}
