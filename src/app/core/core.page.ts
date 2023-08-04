import { Component } from '@angular/core';
import { ofActionCompleted, Store, Actions } from '@ngxs/store';
import { AuthState } from '../auth/store/auth.state';
import { WishlistState } from '../pages/media/wishlist/shared/store/wishlist.state';
import { TeacherNotesState } from '../teacher-notes/store';
import { LibraryState } from '../pages/home/library/store';
import { MaterialState } from '../pages/home/material/store';
import { DownloadState } from '../shared/download';
import { StateReset } from 'ngxs-reset-plugin';
import { Logout } from '../auth/store/auth.actions';
import { NavController } from '@ionic/angular';
import { MediaMusicService } from './services/media-music.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class CorePage {
  constructor(navCtrl: NavController, store: Store, mediaMusicService: MediaMusicService, actions: Actions) {
    // Register Logout handler
    actions.pipe(ofActionCompleted(Logout)).subscribe(() => {
      mediaMusicService.stop();
      localStorage.clear();
      store.dispatch(new StateReset(AuthState, WishlistState, TeacherNotesState, LibraryState, MaterialState, DownloadState));
      navCtrl.navigateRoot('/login');
    });
  }
}
