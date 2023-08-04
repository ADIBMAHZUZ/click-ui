export enum AuthenticationErrorCodes {
  // Wrong username and password.
  CLICk400 = 'CLICk400',
  // The account is inactive.
  CLICk401 = 'CLICk401',
  // This account is logged more than 4 different devices.
  CLICk402 = 'CLICk402',
  // Your library is temporarily locked.
  CLICk403 = 'CLICk403',
  // Max borrow time update.
  CLICk408 = 'CLICk408',
  // Log out failed.
  CLICk409 = 'CLICk409',
}

export type HomeTitle =
  | 'library'
  | 'school_news'
  | 'teacher_notes'
  | 'material'
  | 'school_history'
  | 'student_content';

export interface HomeTitles {
  mediaTitle: string;
  theSchoolHistoryTitle: string;
}
