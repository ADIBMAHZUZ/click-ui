import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared';
import { DownloadableType, DownloadDetailState, DownloadType } from 'src/app/shared/download';
import { NoteIconPathPipe } from 'src/app/shared/pipes/note-icon-path.pipe';
import { TeacherNoteViewType } from 'src/app/teacher-notes/shared';

export interface AbortEvent {
  state: DownloadDetailState<DownloadableType>;
  downloadType: DownloadType;
}

const routingBaseOnDownloadType = {
  MEDIA: 'library',
  LEARNING_MATERIAL: 'material',
  TEACHER_NOTE: 'teacher-notes',
};
@Component({
  selector: 'app-download-item',
  templateUrl: './download-item.component.html',
  styleUrls: ['./download-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadItemComponent implements OnInit {
  @Input() downloadState: DownloadDetailState<DownloadableType>;
  @Input() type: 'MEDIA' | 'LEARNING_MATERIAL' | 'TEACHER_NOTE';
  @Output() abort = new EventEmitter<AbortEvent>();

  route = '';
  thumbnail = '';
  constructor(private noteIconPath: NoteIconPathPipe) {}

  ngOnInit(): void {
    const routeByDownloadType = routingBaseOnDownloadType[this.type] ?? '';
    if (this.type === 'MEDIA' || this.type === 'LEARNING_MATERIAL') {
      const downloadStateWithType = this.downloadState as DownloadDetailState<MediaDetailViewModel>;
      this.route = ['/media', routeByDownloadType, downloadStateWithType.item.mediaType, 'detail', downloadStateWithType.item.id].join('/');
      this.thumbnail = downloadStateWithType.item.thumbnail;
    } else if (this.type === 'TEACHER_NOTE') {
      const downloadStateWithType = this.downloadState as DownloadDetailState<TeacherNoteViewType>;
      this.route = ['/media', routeByDownloadType, downloadStateWithType.item.teacher.id].join('/');
      this.thumbnail = this.noteIconPath.transform(downloadStateWithType.item.type);
    }
  }

  handleAbort(state: DownloadDetailState<DownloadableType>, downloadTypeAsString: string, event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const downloadType = DownloadType[downloadTypeAsString];
    this.abort.emit({ state, downloadType });
  }
}
