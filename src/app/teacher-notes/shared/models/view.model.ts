import { Paging } from '../../../core/models/others/index';
import { TeacherNoteDetailType } from './others.model';
import { DownloadTeacherNoteStateModel } from '../../store/teacher-notes-state.model';

export interface TeacherViewType {
  id: string;
  username: string;
  email: string;
  name: string;
  shortName: string;
  address: string;
  phone: string;
  logo: null | string;
  isActive: boolean;
  userType: string;
  subject: null;
  library: number;
}
export interface BriefTeacherViewType {
  id: string;
  name: string;
  previewUrl: string;
  url: string;
}
export interface TeacherNoteViewType {
  id: string;
  size: string;
  name: string;
  type: TeacherNoteDetailType;
  url: string;
  createdDate: string;
  teacher: BriefTeacherViewType;
}
export interface TeachersView extends Paging<TeacherViewType> {}
export interface TeacherNotesView {
  results: {
    teacher: BriefTeacherViewType;
    notes: Paging<DownloadTeacherNoteStateModel>;
  };
}

export interface DownloadedNotesView {
  results: Array<TeacherNoteViewType>;
}
