import { DownloadDetailState } from '../models/download-detail-state.model';
import { MaterialDetailViewModel } from 'src/app/core/models';
import { TeacherNoteViewType } from 'src/app/teacher-notes/shared';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared/models';

export interface DownloadDetailStates<T> {
  [id: string]: DownloadDetailState<T>;
}

export interface DownloadStateModel {
  downloaded: {
    medias: DownloadDetailStates<MediaDetailViewModel>;
    learningMaterials: DownloadDetailStates<MaterialDetailViewModel>;
    teacherNotes: DownloadDetailStates<TeacherNoteViewType>;
  };
}
export const initialState: DownloadStateModel = {
  downloaded: {
    medias: {},
    learningMaterials: {},
    teacherNotes: {},
  },
};
