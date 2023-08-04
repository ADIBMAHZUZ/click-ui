import {
  TeachersView,
  TeacherNotesView,
  TeacherNoteViewType,
} from '../shared/models/view.model';
import { DownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';

export interface TeacherNotesStateModel {
  teachersView: TeachersView;
  selectedTeacherNotes: TeacherNotesView;
}

export interface DownloadTeacherNoteStateModel
  extends DownloadDetailState<TeacherNoteViewType> {}
