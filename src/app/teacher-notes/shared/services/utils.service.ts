import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DownloadingService } from './downloading.service';
import { TeacherNotesService } from './api.service';
import { DownloadTeacherNoteStateModel } from '../../store/teacher-notes-state.model';
import { DownloadItem } from 'src/app/shared/download/store/download.actions';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { TeacherNotesState } from '../../store';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor(
    private _store: Store,
    private _http: HttpClient,
    private _downloadingService: DownloadingService,
    private _apiService: TeacherNotesService
  ) {}

  public download(
    subject: BehaviorSubject<DownloadTeacherNoteStateModel>
  ): Observable<boolean> {
    const downloadingSubject = this._downloadingService.addSubject(
      subject,
      DownloadType.TEACHER_NOTE
    );
    const state = downloadingSubject.value as DownloadTeacherNoteStateModel;
    const { item } = state;

    const updateDownloadingSubject = () => {
      const noteInStore = this._store.selectSnapshot(
        TeacherNotesState.getNoteById({ id: item.id })
      );
      downloadingSubject.next(noteInStore);
    };
    return this._store.dispatch(
      new DownloadItem({
        downloadType: DownloadType.TEACHER_NOTE,
        item: item,
        onProgress: updateDownloadingSubject,
        onComplete: () => {
          updateDownloadingSubject();
          this._downloadingService.removeSubject(
            DownloadType.TEACHER_NOTE,
            item.id
          );
        },
      })
    );
  }

  public getContentNote(url: string): Promise<string> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    return this._http.get(url, { headers, responseType: 'text' }).toPromise();
  }

  public sendDownloadRequest(noteId: string) {
    return this._apiService.downloadByIds(noteId);
  }

  public sendRemoveRequest(noteId: string) {
    return this._apiService.removeByIds(noteId);
  }
}
