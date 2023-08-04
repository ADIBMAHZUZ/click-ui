import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Observable, combineLatest } from 'rxjs';
import { getDistanceFromTop } from 'src/app/shared/utils';
import { MediasByCategoryViewModel } from '../shared/models';
import { Store, Select } from '@ngxs/store';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import {
  LoadMediasByTypeAndCategoryId,
  LibraryState,
  LoadMediasByTypeAndCategoryIdNext,
  ResetMediaSeeAll,
  LoadMediasByTypeAndCategoryIdOffline,
} from '../store';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private _ionContent: IonContent;
  @ViewChildren('item') private _items: QueryList<any>;

  public cachedCategories: MediasByCategoryViewModel;
  public preTitle: string;

  private _categories$: Observable<MediasByCategoryViewModel>;
  private _subSink = new SubSink();
  private _preScrollY: number;
  private _preLoadmoreUrl: string;

  constructor(private _route: ActivatedRoute, private _store: Store) {}

  public ionViewWillEnter() {
    this._store.dispatch([new ResetMediaSeeAll(), new ResetSearchQuery()]);
    const data$ = this._route.data;
    const categoryId$ = this._route.params.pipe(
      map(({ category }) => category)
    );

    this._categories$ = combineLatest([categoryId$, this.query$, data$]).pipe(
      switchMap(([id, query, data]) => {
        if (data.downloaded) {
          this._store.dispatch(
            new LoadMediasByTypeAndCategoryIdOffline({
              id,
              mediaType: data.type,
              query,
            })
          );
        } else {
          this._store.dispatch(
            new LoadMediasByTypeAndCategoryId({
              id,
              mediaType: data.type,
              query,
            })
          );
        }

        return this._store.select(LibraryState.getSeeAll);
      }),
      tap((categories) => {
        this.cachedCategories = categories;
      }),
      shareReplay({ refCount: true })
    );
    this._subSink.sink = this._categories$.subscribe();
  }
  public ionViewDidEnter(): void {
    this._subSink.sink = this._categories$.subscribe(() => {
      this._infiniteScroll.disabled = false;
      setTimeout(() => {
        if (!this._items?.last) {
          return;
        }
        const lastItem = this._items.last.el;
        const willLoadMore =
          getDistanceFromTop(lastItem) + lastItem.offsetHeight <
          window.innerHeight * 0.9;
        if (willLoadMore) {
          this.loadMore();
        }
      }, 1000);
    });
    if (this._preScrollY) {
      this._ionContent.scrollByPoint(0, this._preScrollY, 2000);
    }
  }
  ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }

  public loadMore() {
    const nextUrl = this.cachedCategories.media.next;

    if (nextUrl !== null && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;

      this._store.dispatch(
        new LoadMediasByTypeAndCategoryIdNext({
          url: nextUrl,
        })
      );
    }

    this._infiniteScroll.complete();
    if (
      this.cachedCategories.media.results.length ==
      this.cachedCategories.media.count
    ) {
      this._infiniteScroll.disabled = true;
    }
  }
}
