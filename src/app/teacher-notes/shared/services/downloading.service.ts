import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';
import {
  DownloadableType,
  DownloadType,
} from 'src/app/shared/download/models/download-type.model';
import { getId, prefixIdMap } from 'src/app/shared/download';

@Injectable({ providedIn: 'root' })
export class DownloadingService {
  downloadingSubjects: Map<
    string,
    BehaviorSubject<DownloadDetailState<DownloadableType>>
  > = new Map();

  addSubject(
    subject: BehaviorSubject<DownloadDetailState<DownloadableType>>,
    downloadType: DownloadType
  ) {
    const state = subject.value;
    const subjectInDownloading = this.getSubject(downloadType, state.item.id);
    if (subjectInDownloading) {
      return subjectInDownloading;
    }
    this.downloadingSubjects.set(getId(downloadType, state.item.id), subject);
    return subject;
  }

  getDownloadingSubjectsByType(
    downloadType: DownloadType
  ): Array<Observable<DownloadDetailState<any>>> {
    return Array.from(this.downloadingSubjects.entries())
      .filter(
        ([key, subject]) =>
          key.startsWith(prefixIdMap[downloadType]) && !subject.value.downloaded
      )
      .map(([, subject]) => subject.asObservable());
  }

  getSubject(downloadType: DownloadType, id: string): BehaviorSubject<any> {
    return this.downloadingSubjects.get(getId(downloadType, id));
  }

  getObservable(downloadType: DownloadType, id: string): Observable<any> {
    return this.downloadingSubjects
      .get(getId(downloadType, id))
      ?.asObservable();
  }
  addSubjectByState(
    state: DownloadDetailState<DownloadableType>,
    downloadType: DownloadType
  ) {
    const subjectInDownloading = this.getSubject(downloadType, state.item.id);
    if (subjectInDownloading) {
      return subjectInDownloading;
    }
    const subject = new BehaviorSubject(state);
    this.downloadingSubjects.set(getId(downloadType, state.item.id), subject);
    return subject;
  }

  removeSubject(downloadType: DownloadType, id: string) {
    this.downloadingSubjects.delete(getId(downloadType, id));
  }

  clearAll() {
    this.downloadingSubjects = new Map();
  }
}
