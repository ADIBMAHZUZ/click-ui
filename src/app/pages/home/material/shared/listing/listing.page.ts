import { combineLatest, Observable, of } from 'rxjs';
import { Component } from '@angular/core';
import { MaterialCategoriesViewModel } from 'src/app/core/models';
import { switchMap, tap } from 'rxjs/operators';
import { MaterialService } from '../../material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Store, Select } from '@ngxs/store';
import { CoreState, ResetSearchQuery } from 'src/app/core/store';
import { MaterialState } from '../../store';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;

  public categoriesVM: MaterialCategoriesViewModel;
  private _subSink = new SubSink();

  constructor(private _route: ActivatedRoute, private _materialService: MaterialService, private _router: Router, private _store: Store) {}

  public navigateTo(url: string[]) {
    this._router.navigate(url, { relativeTo: this._route });
  }

  public ionViewWillEnter() {
    this._store.dispatch(new ResetSearchQuery());
    const data$ = this._route.data;
    this._subSink.sink = combineLatest([this.query$, data$])
      .pipe(
        switchMap(([query, data]) => {
          if (data.downloaded) {
            const sampleCategories: MaterialCategoriesViewModel = {
              categories: [],
            };

            const downloadedMaterials = this._store.selectSnapshot(
              MaterialState.getDownloadedMaterialsByType({ mediaType: data.type, query })
            );
            downloadedMaterials.forEach((media) => {
              const category = sampleCategories.categories.find((cate) => cate.category.id == media.item.category.id);
              if (category) {
                category.media.push(media.item);
              } else {
                sampleCategories.categories.push({
                  category: { id: media.item.category.id, name: media.item.category.name },
                  media: [media.item],
                });
              }
            });
            return of(sampleCategories);
          }
          return this._materialService.getMaterialByMediaType(data.type, query);
        }),
        tap((categories) => (this.categoriesVM = categories))
      )
      .subscribe();
  }

  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }
}
