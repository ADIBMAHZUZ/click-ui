import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DownloadTeacherNoteStateModel } from 'src/app/teacher-notes/store';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileCardComponent {
  @Input() state$: Observable<DownloadTeacherNoteStateModel>;
  @Output() open = new EventEmitter();
  @Output() remove = new EventEmitter();
  handleOpen(state: DownloadTeacherNoteStateModel) {
    this.open.emit(state);
  }
  handleRemove(event: CustomEvent, id: string) {
    event.stopPropagation();
    event.preventDefault();

    this.remove.emit(id);
  }
}
