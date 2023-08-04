import { MaterialDetailViewModel } from 'src/app/core/models';
import { TeacherNoteViewType } from 'src/app/teacher-notes/shared';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared/models';

export enum DownloadType {
  MEDIA = 'medias',
  LEARNING_MATERIAL = 'learningMaterials',
  TEACHER_NOTE = 'teacherNotes',
}

export type DownloadableType =
  | MediaDetailViewModel
  | MaterialDetailViewModel
  | TeacherNoteViewType;
