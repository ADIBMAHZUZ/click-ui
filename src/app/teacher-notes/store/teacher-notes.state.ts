import {
  State,
  Selector,
  Action,
  createSelector,
  Store,
  StateContext,
} from '@ngxs/store';
import { tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TeacherNotesStateModel } from './teacher-notes-state.model';
import {
  LoadTeachers,
  LoadTeachersNext,
  LoadSelectedTeacherNotesNext,
  DownloadAllNotes,
  LoadSelectedTeacherNotesOffline,
  LoadSelectedTeacherNotes,
  LoadTeachersByTeachersView,
  ResetTeachers,
  ResetSelectedNotes,
  UpdateDownloadedNotes,
} from './teacher-notes.actions';
import { TeacherNotesService } from '../shared/services/api.service';
import { getDownloadedNotesByTeacherId } from './teacher-notes.selectors';
import {
  DownloadState,
  DownloadType,
  DownloadStateModel,
  AddItem,
  UpdateItem,
  getId,
  RemoveItem,
} from 'src/app/shared/download';
import { TeacherNoteViewType } from '../shared';
import { NetworkService } from '@core-services';
import { isEquals } from 'src/app/shared/utils';

@Injectable({ providedIn: 'root' })
@State<TeacherNotesStateModel>({
  name: 'teachers',
  defaults: {
    teachersView: null,
    selectedTeacherNotes: null,
  },
})
export class TeacherNotesState {
  constructor(
    private _apiService: TeacherNotesService,
    private _store: Store,
    private _network: NetworkService
  ) {}

  @Selector()
  static getTeachers(state: TeacherNotesStateModel) {
    return state.teachersView;
  }

  @Selector()
  static getSelectedTeacherNotes(state: TeacherNotesStateModel) {
    return state.selectedTeacherNotes;
  }

  static getDownloadedTeacherNotesViews() {
    return createSelector(
      [DownloadState],
      (state: DownloadStateModel) => state.downloaded.teacherNotes
    );
  }

  static getDownloadedNotesByTeacherId({ id, query = '' }) {
    return createSelector([DownloadState], (state: DownloadStateModel) =>
      getDownloadedNotesByTeacherId(state.downloaded.teacherNotes, {
        id,
        query,
      })
    );
  }

  static getNoteById({ id }) {
    const generatedId = getId(DownloadType.TEACHER_NOTE, id);
    return createSelector(
      [DownloadState],
      (state: DownloadStateModel) => state.downloaded.teacherNotes[generatedId]
    );
  }

  @Action(LoadTeachers)
  loadTeachersView(
    { getState, patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadTeachers
  ) {
    const { teachersView } = getState();
    return this._apiService.getTeachers(payload.query).pipe(
      tap((teachers) => {
        if (isEquals(teachers, teachersView)) {
          return;
        }
        patchState({
          teachersView: teachers,
        });
      })
    );
  }

  @Action(LoadTeachersNext)
  loadTeachersViewNext(
    { getState, patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadTeachersNext
  ) {
    return this._apiService.getTeachersNext(payload.url).pipe(
      tap((teachers) => {
        const curTeachers = getState().teachersView;
        teachers.results = curTeachers.results.concat(teachers.results);
        patchState({
          teachersView: teachers,
        });
      })
    );
  }

  @Action(LoadSelectedTeacherNotesNext)
  loadSelectedTeacherNotesNext(
    { getState, patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadSelectedTeacherNotesNext
  ) {
    const { url } = payload;
    let result$ = this._apiService.getNotesByTeacherIdNext(url);
    return result$.pipe(
      tap((teacherNotes) => {
        teacherNotes.results.notes.results = teacherNotes.results.notes.results.map(
          (note) => {
            const noteInDownloaded = this._store.selectSnapshot(
              TeacherNotesState.getNoteById({ id: note.item.id })
            );

            if (noteInDownloaded && noteInDownloaded.item.id == note.item.id) {
              return noteInDownloaded;
            }
            return note;
          }
        );
        teacherNotes.results.notes.results = getState().selectedTeacherNotes.results.notes.results.concat(
          teacherNotes.results.notes.results
        );
        patchState({
          selectedTeacherNotes: teacherNotes,
        });
      })
    );
  }

  @Action(DownloadAllNotes)
  downloadAllNotes(context: StateContext<TeacherNotesStateModel>) {
    return this._apiService.getDownloadedNotes().pipe(
      take(1),
      tap((notes) => {
        for (const note of notes.results) {
          if (note) {
            context.dispatch(
              new AddItem({
                item: note,
                downloadType: DownloadType.TEACHER_NOTE,
              })
            );
          }
        }
      })
    );
  }

  @Action(LoadSelectedTeacherNotesOffline)
  loadSelectedTeacherNotesOffline(
    { patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadSelectedTeacherNotesOffline
  ) {
    const { id, query } = payload;
    const downloadedNotes = this._store.selectSnapshot(
      DownloadState.getDownloadedNotes
    );
    const downloadNotesAsArray = Object.values(downloadedNotes).filter(
      (note) =>
        note?.item?.teacher.id == id &&
        note?.item?.name.toLowerCase().includes(query.toLowerCase())
    );
    if (downloadNotesAsArray.length < 1) {
      return null;
    }
    const notes = {
      results: {
        teacher: downloadNotesAsArray[0].item.teacher,
        notes: {
          count: 0,
          next: null,
          previous: null,
          results: downloadNotesAsArray,
        },
      },
    };
    patchState({
      selectedTeacherNotes: notes,
    });
  }

  @Action(LoadSelectedTeacherNotes)
  LoadSelectedTeacherNotes(
    { getState, patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadSelectedTeacherNotes
  ) {
    const { selectedTeacherNotes } = getState();
    const { id, query, folderUrl } = payload;
    const result$ = this._apiService.getNotesByTeacherIdVer2(
      id,
      query,
      folderUrl
    );
    return result$.pipe(
      tap((teacherNotes) => {
        teacherNotes.results.notes.results = teacherNotes.results.notes.results.map(
          (note) => {
            const noteInDownloaded = this._store.selectSnapshot(
              TeacherNotesState.getNoteById({ id: note.item.id })
            );

            if (noteInDownloaded && noteInDownloaded.item.id == note.item.id) {
              return noteInDownloaded;
            }
            return note;
          }
        );
        if (isEquals(selectedTeacherNotes, teacherNotes)) {
          return;
        }
        patchState({
          selectedTeacherNotes: teacherNotes,
        });
      })
    );
  }

  @Action(LoadTeachersByTeachersView) loadTeachersByTeachersView(
    { getState, patchState }: StateContext<TeacherNotesStateModel>,
    { payload }: LoadTeachersByTeachersView
  ) {
    const { teachersView } = getState();

    if (isEquals(payload.teachersView, teachersView)) {
      return;
    }
    patchState({
      teachersView: payload.teachersView,
    });
  }

  @Action(ResetTeachers)
  resetTeachers({ patchState }: StateContext<TeacherNotesStateModel>) {
    patchState({
      teachersView: null,
    });
  }

  @Action(ResetSelectedNotes)
  resetSelectedNotes({ patchState }: StateContext<TeacherNotesStateModel>) {
    patchState({
      selectedTeacherNotes: null,
    });
  }

  @Action(UpdateDownloadedNotes)
  updateDownloadedNotes({ dispatch }: StateContext<TeacherNotesStateModel>) {
    if (!this._network.isConnected()) {
      return;
    }
    const downloadedNotes = this._store.selectSnapshot(
      DownloadState.getDownloadedNotes
    );
    return this._apiService.getDownloadedNotes().pipe(
      take(1),
      tap((notes) => {
        const downloadedKeys = Object.keys(downloadedNotes);
        const downloadedExtractKeys = downloadedKeys.map((key) => key.slice(3));
        const updatedItems: TeacherNoteViewType[] = [];
        const addedItems: TeacherNoteViewType[] = [];

        for (const noteFromServer of notes.results) {
          const id = noteFromServer.id.toString();
          const indexOfKeyInDownloadedNotes = downloadedExtractKeys.indexOf(id);

          if (indexOfKeyInDownloadedNotes > -1) {
            updatedItems.push(noteFromServer);
            downloadedExtractKeys.splice(indexOfKeyInDownloadedNotes, 1);
          } else {
            addedItems.push(noteFromServer);
          }
        }
        for (const note of updatedItems) {
          dispatch(
            new UpdateItem({
              id: note.id,
              item: note,
              downloadType: DownloadType.TEACHER_NOTE,
            })
          );
        }
        for (const note of addedItems) {
          dispatch(
            new AddItem({
              item: note,
              downloadType: DownloadType.TEACHER_NOTE,
            })
          );
        }
        for (const key of downloadedExtractKeys) {
          dispatch(
            new RemoveItem({
              id: key,
              downloadType: DownloadType.TEACHER_NOTE,
            })
          );
        }
      })
    );
  }
}
