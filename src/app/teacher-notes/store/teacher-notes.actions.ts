import { TeachersView } from '../shared/models';

const enum Actions {
  LOAD_TEACHERS = '[TeacherNotes] Load Teachers',
  LOAD_TEACHERS_BY_TEACHERS_VIEW = '[TeacherNotes] Load Teachers by TeacherViews',
  LOAD_TEACHERS_NEXT = '[TeacherNotes] Load Teachers Next',
  LOAD_SELECTED_TEACHER_NOTES = '[TeacherNotes] Load Selected Teacher Notes',
  LOAD_SELECTED_TEACHER_NOTES_OFFLINE = '[TeacherNotes] Load Selected Teacher Notes Offline',
  LOAD_SELECTED_TEACHER_NOTES_NEXT = '[TeacherNotes] Load Selected Teacher Notes Next',
  DOWNLOAD_ALL_NOTES = '[TeacherNotes] Download All Notes',
  LOAD_SELECTED_TEACHER_NOTES_VER2 = '[TeacherNotes] Load Selected Teacher Notes Ver 2',
  RESET_TEACHERS = '[TeacherNotes] Reset Teachers',
  RESET_SELECTED_NOTES = '[TeacherNotes] Reset Selected Teacher Notes',
  UPDATE_DOWNLOADED_NOTES = '[TeacherNotes] Update Downloaded Notes',
}

export class LoadTeachers {
  static readonly type = Actions.LOAD_TEACHERS;
  constructor(public readonly payload: { query: string }) {}
}
export class LoadTeachersNext {
  static readonly type = Actions.LOAD_TEACHERS_NEXT;
  constructor(public readonly payload: { url: string }) {}
}

export class LoadSelectedTeacherNotesNext {
  static readonly type = Actions.LOAD_SELECTED_TEACHER_NOTES_NEXT;
  constructor(public readonly payload: { url: string }) {}
}

export class DownloadAllNotes {
  static readonly type: string = Actions.DOWNLOAD_ALL_NOTES;
}

export class LoadSelectedTeacherNotesOffline {
  static readonly type = Actions.LOAD_SELECTED_TEACHER_NOTES_OFFLINE;
  constructor(public readonly payload: { id: string; query?: string }) {}
}

export class LoadSelectedTeacherNotes {
  static readonly type = Actions.LOAD_SELECTED_TEACHER_NOTES;
  constructor(
    public readonly payload: { id: string; query?: string; folderUrl?: string }
  ) {}
}

export class LoadTeachersByTeachersView {
  static readonly type = Actions.LOAD_TEACHERS_BY_TEACHERS_VIEW;
  constructor(public readonly payload: { teachersView: TeachersView }) {}
}

export class ResetTeachers {
  static readonly type = Actions.RESET_TEACHERS;
}

export class ResetSelectedNotes {
  static readonly type = Actions.RESET_SELECTED_NOTES;
}
export class UpdateDownloadedNotes {
  static readonly type = Actions.UPDATE_DOWNLOADED_NOTES;
}
