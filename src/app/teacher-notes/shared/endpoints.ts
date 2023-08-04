import { environment } from 'src/environments/environment';

const { API_URL } = environment;

const teachers = `${API_URL}users/teachers/`;
const teacherNotes = `${API_URL}teacher_notes/:id/`;
const teacherNotesDownload = `${API_URL}notes/download/:id/`;
const teacherNotesRemove = `${API_URL}notes/return/:id/`;
const teacherNotesDownloaded = `${API_URL}notes/downloaded/`;
const teacherNotesList = `${API_URL}teacher_notes/:id/list/`;
const teacherNotesVer2 = `${API_URL}notes/:id/`;

export const TEACHER_NOTES_ENDPOINTS = {
  teachers,
  teacherNotes,
  teacherNotesDownload,
  teacherNotesRemove,
  teacherNotesDownloaded,
  teacherNotesList,
  teacherNotesVer2,
};
