import { DownloadDetailStates } from 'src/app/shared/download/store/download-state.model';
import { TeacherNoteViewType, TeacherNotesView } from '../shared';

export function getDownloadedNotesByTeacherId(
  downloadedNotes: DownloadDetailStates<TeacherNoteViewType>,
  { id, query = '' }
): TeacherNotesView {
  const downloadNotesAsArray = Object.values(downloadedNotes).filter(
    (note) =>
      note?.item?.teacher.id == id &&
      note?.item?.name.toLowerCase().includes(query.toLowerCase())
  );
  if (downloadNotesAsArray.length < 1) {
    return null;
  }
  return {
    results: {
      teacher: downloadNotesAsArray[0].item.teacher,
      notes: {
        count: 0,
        next: null,
        previous: null,
        results: downloadNotesAsArray,
      },
    },
  };
}
