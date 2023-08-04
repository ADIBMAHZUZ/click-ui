import { Observable, zip } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { AllMediaFavoriteViewModel } from './shared';
import { MediaType } from 'src/app/core/models';
import { Store, Select } from '@ngxs/store';
import { WishlistState } from './shared/store/wishlist.state';
import { LoadFavoriteByMediaType } from './shared/store/wishlist.actions';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements ViewWillEnter, ViewWillLeave, OnDestroy {
  @Select(WishlistState.getBook) book$: Observable<AllMediaFavoriteViewModel>;
  @Select(WishlistState.getAudio) audio$: Observable<AllMediaFavoriteViewModel>;
  @Select(WishlistState.getVideo) video$: Observable<AllMediaFavoriteViewModel>;

  bookList: AllMediaFavoriteViewModel;
  audioList: AllMediaFavoriteViewModel;
  videoList: AllMediaFavoriteViewModel;

  private _subSink = new SubSink();
  constructor(private _store: Store, private _router: Router) {}

  ionViewWillEnter() {
    this._store.dispatch(new LoadFavoriteByMediaType({ mediaType: MediaType.BOOK }));
    this._store.dispatch(new LoadFavoriteByMediaType({ mediaType: MediaType.AUDIO }));
    this._store.dispatch(new LoadFavoriteByMediaType({ mediaType: MediaType.VIDEO }));
    this._subSink.sink = zip(this.book$, this.audio$, this.video$).subscribe(([books, audios, videos]) => {
      this.bookList = books;
      this.audioList = audios;
      this.videoList = videos;
    });
  }

  ionViewWillLeave() {
    this._subSink.unsubscribe();
  }
  ngOnDestroy() {
    this.ionViewWillLeave();
  }

  navigateTo(url: string[]) {
    this._router.navigateByUrl('/home/library/' + url.join('/'));
  }
}
