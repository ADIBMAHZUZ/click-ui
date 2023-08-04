import { getFileExtension } from '../../utils';
import { DownloadableType, DownloadType } from '../models/download-type.model';
import { TeacherNoteViewType } from 'src/app/teacher-notes/shared';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared/models';

export const prefixIdMap = {
  [DownloadType.MEDIA]: 'ME',
  [DownloadType.LEARNING_MATERIAL]: 'LE',
  [DownloadType.TEACHER_NOTE]: 'TE',
};

export function getDownloadableExtension(
  downloadType: DownloadType,
  item: DownloadableType
): string {
  let extension = null;
  if (downloadType === DownloadType.TEACHER_NOTE) {
    extension = (item as TeacherNoteViewType).type;
  } else if (
    downloadType === DownloadType.MEDIA ||
    downloadType === DownloadType.LEARNING_MATERIAL
  ) {
    extension = getFileExtension((item as MediaDetailViewModel).mediaType);
  }
  return extension;
}

export function getId(downloadType: DownloadType, id: string): string {
  return `${prefixIdMap[downloadType]}_${id}`;
}
