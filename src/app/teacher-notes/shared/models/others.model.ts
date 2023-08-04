export enum TeacherNoteDetailType {
  folder = 'folder',
  txt = 'txt',
  pdf = 'pdf',
  mp3 = 'mp3',
  mp4 = 'mp4',
  xls = 'xls',
  xlt = 'xlt',
  xlsx = 'xlsx',
  xlsm = 'xlsm',
  csv = 'csv',
  docx = 'docx',
  dot = 'dot',
  doc = 'doc',
  dotx = 'dotx',
  docm = 'docm',
  pptx = 'pptx',
  ppt = 'ppt',
  pot = 'pot',
}
export const mimeTypeMapper = {
  [TeacherNoteDetailType.xls]: 'application/vnd.ms-excel',
  [TeacherNoteDetailType.xlt]: 'application/vnd.ms-excel',
  [TeacherNoteDetailType.xlsx]:
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  [TeacherNoteDetailType.xlsm]:
    'application/vnd.ms-excel.sheet.macroenabled.12',
  [TeacherNoteDetailType.csv]: 'text/csv',
  [TeacherNoteDetailType.docx]:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [TeacherNoteDetailType.dot]: 'application/msword',
  [TeacherNoteDetailType.doc]: 'application/msword',
  [TeacherNoteDetailType.dotx]:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  [TeacherNoteDetailType.docm]:
    'application/vnd.ms-word.document.macroenabled.12',
  [TeacherNoteDetailType.pptx]:
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  [TeacherNoteDetailType.ppt]: 'application/vnd.ms-powerpoint',
  [TeacherNoteDetailType.pot]: 'application/vnd.ms-powerpoint',
};
export const googlePlayMapper = {
  [TeacherNoteDetailType.xls]: 'com.microsoft.office.excel',
  [TeacherNoteDetailType.xlt]: 'com.microsoft.office.excel',
  [TeacherNoteDetailType.xlsx]: 'com.microsoft.office.excel',
  [TeacherNoteDetailType.xlsm]: 'com.microsoft.office.excel',
  [TeacherNoteDetailType.csv]: 'com.microsoft.office.excel',
  [TeacherNoteDetailType.docx]: 'com.microsoft.office.word',
  [TeacherNoteDetailType.dot]: 'com.microsoft.office.word',
  [TeacherNoteDetailType.doc]: 'com.microsoft.office.word',
  [TeacherNoteDetailType.dotx]: 'com.microsoft.office.word',
  [TeacherNoteDetailType.docm]: 'com.microsoft.office.word',
  [TeacherNoteDetailType.pptx]: 'com.microsoft.office.powerpoint',
  [TeacherNoteDetailType.ppt]: 'com.microsoft.office.powerpoint',
  [TeacherNoteDetailType.pot]: 'com.microsoft.office.powerpoint',
};

export const appStoreMapper = {
  [TeacherNoteDetailType.xls]: 'id586683407',
  [TeacherNoteDetailType.xlt]: 'id586683407',
  [TeacherNoteDetailType.xlsx]: 'id586683407',
  [TeacherNoteDetailType.xlsm]: 'id586683407',
  [TeacherNoteDetailType.csv]: 'id586683407',
  [TeacherNoteDetailType.docx]: 'id586447913',
  [TeacherNoteDetailType.dot]: 'id586447913',
  [TeacherNoteDetailType.doc]: 'id586447913',
  [TeacherNoteDetailType.dotx]: 'id586447913',
  [TeacherNoteDetailType.docm]: 'id586447913',
  [TeacherNoteDetailType.pptx]: 'id586449534',
  [TeacherNoteDetailType.ppt]: 'id586449534',
  [TeacherNoteDetailType.pot]: 'id586449534',
};

export const iOSUrlPrefixMapper = {
  [TeacherNoteDetailType.xls]: 'ms-excel',
  [TeacherNoteDetailType.xlt]: 'ms-excel',
  [TeacherNoteDetailType.xlsx]: 'ms-excel',
  [TeacherNoteDetailType.xlsm]: 'ms-excel',
  [TeacherNoteDetailType.csv]: 'ms-excel',
  [TeacherNoteDetailType.docx]: 'ms-word',
  [TeacherNoteDetailType.dot]: 'ms-word',
  [TeacherNoteDetailType.doc]: 'ms-word',
  [TeacherNoteDetailType.dotx]: 'ms-word',
  [TeacherNoteDetailType.docm]: 'ms-word',
  [TeacherNoteDetailType.pptx]: 'ms-powerpoint',
  [TeacherNoteDetailType.ppt]: 'ms-powerpoint',
  [TeacherNoteDetailType.pot]: 'ms-powerpoint',
};
