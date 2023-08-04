import { Paging } from '../../../core/models/others/index';
import { TeacherNoteDetailType } from './others.model';
export interface TeacherType {
  id: string;
  username: string;
  email: string;
  name: string;
  short_name: string;
  address: string;
  phone: string;
  logo: null | string;
  is_active: boolean;
  user_type: string;
  subject: null;
  library: number;
}
export interface BriefTeacherType {
  id: string;
  name: string;
  preview_url: string;
  url: string;
}
export interface TeacherNoteType {
  id: string;
  size: string;
  name: string;
  file_type: TeacherNoteDetailType;
  url: string;
  created_date: string;
}
export interface TeacherNoteTypeHasTeacher extends TeacherNoteType {
  teacher: BriefTeacherType;
}
export interface TeachersResponse extends Paging<TeacherType> {}
export interface TeacherNotesResponse {
  results: {
    teacher: BriefTeacherType;
    notes: Paging<TeacherNoteType>;
  };
}
export interface DownloadedNotesResponse {
  results: Array<TeacherNoteTypeHasTeacher>;
}
