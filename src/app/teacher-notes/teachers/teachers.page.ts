import { Component, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { TeachersView, TeacherNoteViewType } from '../shared/models';
import { Observable } from 'rxjs';
import { Store, Select, Actions, ofActionCompleted } from '@ngxs/store';
import {
  LoadTeachers,
  TeacherNotesState,
  LoadTeachersNext,
  LoadTeachersByTeachersView,
  ResetTeachers,
  UpdateDownloadedNotes,
} from '../shared';
import { map, tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Converter } from '../shared/services';
import { IonInfiniteScroll, IonCard, ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { getDistanceFromTop } from 'src/app/shared/utils';
import { DownloadDetailStates } from 'src/app/shared/download';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements ViewDidEnter, ViewWillLeave, OnDestroy {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;
  @Select(TeacherNotesState.getTeachers) teachers$: Observable<TeachersView>;
  @Select(TeacherNotesState.getDownloadedTeacherNotesViews())
  downloadedNotes$: Observable<DownloadDetailStates<TeacherNoteViewType>>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChildren('item') private _items: QueryList<IonCard>;

  teachers: TeachersView;

  private _subSink = new SubSink();
  private _preLoadmoreUrl = '';

  constructor(private _store: Store, private _route: ActivatedRoute, private _converter: Converter, private _actions: Actions) {}
  async ionViewDidEnter() {
    await this._store.dispatch([new ResetSearchQuery(), new ResetTeachers()]).toPromise();
    const isInMyMedia = this._route.snapshot.data.downloaded;
    if (isInMyMedia) {
      await this._store.dispatch(new UpdateDownloadedNotes()).toPromise();
    }
    this._registerLoadTeachersCompleted();
    this._subSink.sink = this.query$
      .pipe(
        switchMap((query) => {
          if (!isInMyMedia) {
            return this._store.dispatch(new LoadTeachers({ query }));
          }

          return this.downloadedNotes$.pipe(
            map((downloadNotes) => this._converter.fromDownloadedTeacherNoteStateModel__TeachersView(downloadNotes, query)),
            tap((teachersView) => {
              this._store.dispatch(new LoadTeachersByTeachersView({ teachersView }));
            })
          );
        })
      )
      .subscribe();
    this._subSink.sink = this.teachers$.subscribe((teachers) => {
      this.teachers = teachers;
    });
  }
  private _registerLoadTeachersCompleted() {
    this._subSink.sink = this._actions.pipe(ofActionCompleted(LoadTeachers)).subscribe(() => {
      this._checkLoadmore();
    });
  }

  ionViewWillLeave() {
    this._subSink.unsubscribe();
  }

  ngOnDestroy() {
    this.ionViewWillLeave();
  }
  public loadMore() {
    const nextUrl = this.teachers?.next;

    if (nextUrl && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;

      this._store.dispatch(
        new LoadTeachersNext({
          url: nextUrl,
        })
      );
    }

    this._infiniteScroll.complete();
    if (this.teachers.results.length == this.teachers.count) {
      this._infiniteScroll.disabled = true;
    }
  }

  getTitle(): string {
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    const language = this._store.selectSnapshot(CoreState.getLanguage);
    return language === 'ms' ? userInfo?.library?.teacherNotesTitleMs : userInfo?.library?.teacherNotesTitleEn;
  }

  private _checkLoadmore() {
    this._infiniteScroll.disabled = false;

    setTimeout(() => {
      const lastItem = (this._items.last as any)?.el;
      if (lastItem) {
        const willLoadMore = getDistanceFromTop(lastItem) + lastItem?.offsetHeight < window.innerHeight * 0.9;

        if (willLoadMore) {
          this.loadMore();
        }
      }
    }, 1000);
  }
}
