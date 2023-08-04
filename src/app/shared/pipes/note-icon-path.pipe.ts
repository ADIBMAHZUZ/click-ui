import { Pipe, PipeTransform } from '@angular/core';
import { TeacherNoteDetailType } from 'src/app/teacher-notes/shared';

@Pipe({ name: 'noteIconPath' })
export class NoteIconPathPipe implements PipeTransform {
  transform(type: TeacherNoteDetailType): string {
    let value = TeacherNoteDetailType[type];
    if (value == 'xls' || value == 'xlt' || value == 'xlsx' || value == 'xlsm' || value == 'csv') {
      value = TeacherNoteDetailType.xls;
    } else if (value == 'docx' || value == 'dotx' || value == 'dot' || value == 'docm' || value == 'doc') {
      value = TeacherNoteDetailType.doc;
    } else if (value == 'pptx' || value == 'ppt' || value == 'pot') {
      value = TeacherNoteDetailType.ppt;
    }
    return value ? `assets/icons/${value}-icon.svg` : 'undefined';
  }
}
