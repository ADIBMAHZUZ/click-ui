import {
  Component,
  ViewChild,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Observable, combineLatest, of } from 'rxjs';
import { MaterialByCategoryViewModel } from 'src/app/core/models';
import { getDistanceFromTop } from 'src/app/shared/utils';
import { MaterialService } from '../../material.service';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { Select, Store } from '@ngxs/store';
import { MaterialState } from '../../store';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage implements OnDestroy {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;
  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private _ionContent: IonContent;
  @ViewChildren('item') private _items: QueryList<any>;

  public cachedCategories: MaterialByCategoryViewModel;
  public preTitle: string;

  private _categories$: Observable<MaterialByCategoryViewModel>;
  private _subSink = new SubSink();
  private _preScrollY: number;

  constructor(
    private _route: ActivatedRoute,
    private _materialService: MaterialService,
    private _store: Store
  ) {}

  public ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    const data$ = this._route.data;
    const categoryId$ = this._route.params.pipe(
      map(({ category }) => category)
    );

    this._categories$ = combineLatest([categoryId$, this.query$, data$]).pipe(
      switchMap(([id, query, data]) => {
        if (data.downloaded) {
          const sampleCategory: MaterialByCategoryViewModel = {
            category: null,
            media: {
              count: 0,
              previous: null,
              next: null,
              results: [],
            },
          };

          const downloadedMaterials = this._store.selectSnapshot(
            MaterialState.getDownloadedMaterialsByType({
              mediaType: data.type,
              categoryId: id,
              query,
            })
          );
          downloadedMaterials.forEach((media) => {
            if (!sampleCategory.category) {
              if (media.item.category.name) {
                this.preTitle = media.item.category.name;
              }
              sampleCategory.category = {
                id: media.item.category.id,
                name: media.item.category.name,
              };
            }
            sampleCategory.media.results.push(media.item);
          });

          return of(sampleCategory);
        }
        return this._materialService.getMaterialByCategoryId(
          id,
          data.type,
          query
        );
      }),
      tap((categories) => {
        this.cachedCategories = categories;
        this.preTitle = categories.category.name;
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
    this.ngOnDestroy();
  }
  ngOnDestroy(): void {
    this._subSink.unsubscribe();
  }

  public loadMore() {
    const nextUrl = this.cachedCategories.media.next;
    if (nextUrl !== null) {
      this._subSink.sink = this._materialService
        .getMaterialByCategoryIdMore(nextUrl)
        .pipe(
          tap((newCategories) => {
            newCategories.media.results = this.cachedCategories.media.results.concat(
              newCategories.media.results
            );
            this.cachedCategories = newCategories;
          })
        )
        .subscribe();
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
