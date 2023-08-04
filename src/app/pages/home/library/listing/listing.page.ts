import { combineLatest, Observable } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { CategoriesViewModel } from '../shared/models';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { LoadMediasByType, LibraryState, LoadMediasByTypeOffline, UpdateDownloadedMedias } from '../store';
import { NetworkService } from '@core-services';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements ViewWillEnter, ViewWillLeave, OnDestroy {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  categoriesVM: CategoriesViewModel;
  private _subSink = new SubSink();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store,
    private _actions: Actions,
    private _network: NetworkService
  ) {}

  ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    this._subSink.sink = this._actions
      .pipe(ofActionSuccessful(UpdateDownloadedMedias), withLatestFrom(this.query$, this._route.data))
      .subscribe(([, query, data]) => {
        this._store.dispatch(new LoadMediasByTypeOffline({ mediaType: data.type, query }));
      });
    this._subSink.sink = combineLatest([this.query$, this._route.data])
      .pipe(
        tap(([query, data]) => {
          if (data.downloaded) {
            if (this._network.isConnected()) {
              this._store.dispatch(new UpdateDownloadedMedias());
            } else {
              this._store.dispatch(new LoadMediasByTypeOffline({ mediaType: data.type, query }));
            }
          } else {
            this._store.dispatch(new LoadMediasByType({ mediaType: data.type, query }));
          }
        }),
        switchMap(([, data]) => this._store.select(LibraryState.getListing(data.type, data.downloaded)))
      )
      .subscribe((categories) => {
        this.categoriesVM = categories;
      });
  }
  ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }

  ngOnDestroy(): void {
    this.ionViewWillLeave();
  }

  navigateTo(url: string[]) {
    this._router.navigate(url, { relativeTo: this._route });
  }
}
