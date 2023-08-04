import { Successable } from '../../../core/models/others';
import { AuthenticationErrorCodes } from './others.model';

export interface ErrorableViewModel {
  error?: string;
}

export interface LoginErrorableViewModel {
  // error: string;
  code: AuthenticationErrorCodes;
  success: boolean;
}
export interface ForgotPasswordViewModel
  extends Successable,
    ErrorableViewModel {}

export interface LoginViewModel extends Successable, LoginErrorableViewModel {
  userId: string;
  username: string;
  email: string;
  token: string;
  name: string;
  shortName: string;
  userType: string;
  maxDownload: number;
  maxBorrowDuration: number;
  logo: string;
  library: {
    id: string;
    logo: string;
    name: string;
    shortName: string;
    created: string;
    modified: string;
    isActive: boolean;
    entireBackgroundType: string;
    entireBackgroundImage: string;
    entireBackgroundColor: string;
    mediaTitleColor: string;
    mediaBorderColor: string;
    mediaBadgeColor: string;
    mediaIconColor: string;
    mediaBackgroundTransparent: string;
    mediaBackgroundType: string;
    mediaBackgroundColor: string;
    mediaBackgroundImage: string;
    schoolNewsBoardTitleColor: string;
    schoolNewsBoardBorderColor: string;
    schoolNewsBoardBadgeColor: string;
    schoolNewsBoardIconColor: string;
    schoolNewsBoardBackgroundTransparent: string;
    schoolNewsBoardBackgroundType: string;
    schoolNewsBoardBackgroundColor: string;
    schoolNewsBoardBackgroundImage: string;
    teacherNotesTitleColor: string;
    teacherNotesBorderColor: string;
    teacherNotesBadgeColor: string;
    teacherNotesIconColor: string;
    teacherNotesBackgroundTransparent: string;
    teacherNotesBackgroundType: string;
    teacherNotesBackgroundColor: string;
    teacherNotesBackgroundImage: string;
    learningMaterialTitleColor: string;
    learningMaterialBorderColor: string;
    learningMaterialBadgeColor: string;
    learningMaterialIconColor: string;
    learningMaterialBackgroundTransparent: string;
    learningMaterialBackgroundType: string;
    learningMaterialBackgroundColor: string;
    learningMaterialBackgroundImage: string;
    theSchoolHistoryTitleColor: string;
    theSchoolHistoryBorderColor: string;
    theSchoolHistoryIconColor: string;
    theSchoolHistoryBadgeColor: string;
    theSchoolHistoryBackgroundTransparent: string;
    theSchoolHistoryBackgroundType: string;
    theSchoolHistoryBackgroundColor: string;
    theSchoolHistoryBackgroundImage: string;
    studentContentTitleColor: string;
    studentContentBorderColor: string;
    studentContentIconColor: string;
    studentContentBadgeColor: string;
    studentContentBackgroundTransparent: string;
    studentContentBackgroundType: string;
    studentContentBackgroundColor: string;
    studentContentBackgroundImage: string;
    mediaTitle: string;
    mediaTitleEn: string;
    mediaTitleMs: string;
    schoolNewsBoardTitle: string;
    schoolNewsBoardTitleEn: string;
    schoolNewsBoardTitleMs: string;
    teacherNotesTitle: string;
    teacherNotesTitleEn: string;
    teacherNotesTitleMs: string;
    learningMaterialTitle: string;
    learningMaterialTitleEn: string;
    learningMaterialTitleMs: string;
    theSchoolHistoryTitle: string;
    theSchoolHistoryTitleEn: string;
    theSchoolHistoryTitleMs: string;
    studentContentTitle: string;
    studentContentTitleEn: string;
    studentContentTitleMs: string;
  };
}
