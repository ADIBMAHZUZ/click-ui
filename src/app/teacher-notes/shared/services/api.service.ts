import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TEACHER_NOTES_ENDPOINTS } from '../endpoints';
import { Converter } from './converter.service';
import {
  TeachersView,
  TeachersResponse,
  TeacherNotesView,
  TeacherNotesResponse,
  DownloadedNotesView,
  DownloadedNotesResponse,
} from '../models';
import { Successable } from 'src/app/core/models';

@Injectable({ providedIn: 'root' })
export class TeacherNotesService {
  constructor(private httpClient: HttpClient, private _converter: Converter) {}

  public getTeachers(query?: string): Observable<TeachersView> {
    return this.httpClient
      .get<TeachersResponse>(TEACHER_NOTES_ENDPOINTS.teachers, {
        params: {
          search: query ?? '',
        },
      })
      .pipe(
        map((teachers) =>
          this._converter.fromTeachersResponse__TeachersViewModel(teachers)
        )
      );
  }
  public getTeachersNext(url: string): Observable<TeachersView> {
    return this.httpClient
      .get<TeachersResponse>(url)
      .pipe(
        map((teachers) =>
          this._converter.fromTeachersResponse__TeachersViewModel(teachers)
        )
      );
  }
  public getNotesByTeacherId(
    id: string,
    query?: string
  ): Observable<TeacherNotesView> {
    return this.httpClient
      .get<TeacherNotesResponse>(
        TEACHER_NOTES_ENDPOINTS.teacherNotes.replace(':id', id),
        {
          params: {
            name: query ?? '',
          },
        }
      )
      .pipe(
        map((teacherNotes) =>
          this._converter.fromTeacherNotesResponse__TeacherNotesViewType(
            teacherNotes
          )
        )
      );
  }
  public getNotesByTeacherIdNext(url: string): Observable<TeacherNotesView> {
    return this.httpClient
      .post<TeacherNotesResponse>(url, {})
      .pipe(
        map((teacherNotes) =>
          this._converter.fromTeacherNotesResponse__TeacherNotesViewType(
            teacherNotes
          )
        )
      );
  }

  public downloadByIds(noteId: string): Observable<Successable> {
    return this.httpClient.post<Successable>(
      TEACHER_NOTES_ENDPOINTS.teacherNotesDownload.replace(':id', noteId),
      {}
    );
  }

  public removeByIds(noteId: string): Observable<Successable> {
    return this.httpClient.post<Successable>(
      TEACHER_NOTES_ENDPOINTS.teacherNotesRemove.replace(':id', noteId),
      {}
    );
  }

  public getDownloadedNotes(): Observable<DownloadedNotesView> {
    return this.httpClient
      .get<DownloadedNotesResponse>(
        TEACHER_NOTES_ENDPOINTS.teacherNotesDownloaded
      )
      .pipe(
        map((response) =>
          this._converter.fromDownloadedNotesResponse__DownloadedNotesView(
            response
          )
        )
      );
  }
  public getNotesByTeacherIdVer2(
    id: string,
    query?: string,
    folderUrl?: string
  ): Observable<TeacherNotesView> {
    const params = folderUrl
      ? {
          folder: folderUrl,
        }
      : undefined;
    return this.httpClient
      .post<TeacherNotesResponse>(
        `${TEACHER_NOTES_ENDPOINTS.teacherNotesVer2.replace(':id', id)}?q=${
          query ? query : ''
        }`,
        params
      )
      .pipe(
        map((teacherNotes) =>
          this._converter.fromTeacherNotesResponse__TeacherNotesViewType(
            teacherNotes
          )
        )
      );
  }
}
