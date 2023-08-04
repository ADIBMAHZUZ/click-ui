import { TeacherNotesState } from '../teacher-notes/shared';
import { WishlistState } from '../pages/media/wishlist/shared/store/wishlist.state';
import { AuthState } from 'src/app/auth/store/auth.state';
import { CoreState } from '../core/store/core.state';
import { DownloadState } from '../shared/download/store/download.state';
import { LibraryState } from '../pages/home/library/store';
import { MaterialState } from '../pages/home/material/store';

export const appState = [CoreState, AuthState, TeacherNotesState, DownloadState, LibraryState, MaterialState, WishlistState];
export const appStoredState = [CoreState, LibraryState, MaterialState, TeacherNotesState, DownloadState, AuthState];
