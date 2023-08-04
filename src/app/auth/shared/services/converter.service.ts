import { Injectable } from '@angular/core';
import {
  ForgotPasswordResponse,
  LoginResponse,
  ForgotPasswordViewModel,
  LoginViewModel,
  LoginErrorable,
  AuthenticationErrorCodes,
} from '../models';

@Injectable({ providedIn: 'root' })
export class Converter {
  fromForgotPasswordResponse__ForgotPasswordViewModel(forgotPasswordResponse: ForgotPasswordResponse): ForgotPasswordViewModel {
    return forgotPasswordResponse;
  }
  fromLoginResponse__LoginViewModel(loginResponse: LoginResponse): LoginViewModel | LoginErrorable {
    const {
      success,
      user_id,
      username,
      logo,
      email,
      token,
      name,
      short_name,
      user_type,
      library,
      error,
      code,
      max_download,
      max_borrow_duration,
    } = loginResponse;
    if (success) {
      if (user_type === 'subscriber') {
        return {
          success,
          userId: user_id,
          username,
          email,
          token,
          logo,
          name,
          shortName: short_name,
          userType: user_type,
          error: error,
          code: code,
          maxDownload: max_download,
          maxBorrowDuration: max_borrow_duration,
          library: {
            id: library.id,
            logo: library.logo,
            name: library.name,
            shortName: library.short_name,
            created: library.created,
            modified: library.modified,
            isActive: library.is_active,
            entireBackgroundType: library.entire_background_type,
            entireBackgroundImage: library.entire_background_image,
            entireBackgroundColor: library.entire_background_color,

            mediaTitleColor: library.media_title_color,
            mediaBorderColor: library.media_border_color,
            mediaBadgeColor: library.media_badge_color,
            mediaIconColor: library.media_icon_color,
            mediaBackgroundTransparent: library.media_background_transparent,
            mediaBackgroundType: library.media_background_type,
            mediaBackgroundColor: library.media_background_color,
            mediaBackgroundImage: library.media_background_image,

            schoolNewsBoardTitleColor: library.school_news_board_title_color,
            schoolNewsBoardBorderColor: library.school_news_board_border_color,
            schoolNewsBoardBadgeColor: library.school_news_board_badge_color,
            schoolNewsBoardIconColor: library.school_news_board_icon_color,
            schoolNewsBoardBackgroundTransparent: library.school_news_board_background_transparent,
            schoolNewsBoardBackgroundType: library.school_news_board_background_type,
            schoolNewsBoardBackgroundColor: library.school_news_board_background_color,
            schoolNewsBoardBackgroundImage: library.school_news_board_background_image,

            teacherNotesTitleColor: library.teacher_notes_title_color,
            teacherNotesBorderColor: library.teacher_notes_border_color,
            teacherNotesBadgeColor: library.teacher_notes_badge_color,
            teacherNotesIconColor: library.teacher_notes_icon_color,
            teacherNotesBackgroundTransparent: library.teacher_notes_background_transparent,
            teacherNotesBackgroundType: library.teacher_notes_background_type,
            teacherNotesBackgroundColor: library.teacher_notes_background_color,
            teacherNotesBackgroundImage: library.teacher_notes_background_image,

            learningMaterialTitleColor: library.learning_material_title_color,
            learningMaterialBorderColor: library.learning_material_border_color,
            learningMaterialBadgeColor: library.learning_material_badge_color,
            learningMaterialIconColor: library.learning_material_icon_color,
            learningMaterialBackgroundTransparent: library.learning_material_background_transparent,
            learningMaterialBackgroundType: library.learning_material_background_type,
            learningMaterialBackgroundColor: library.learning_material_background_color,
            learningMaterialBackgroundImage: library.learning_material_background_image,

            theSchoolHistoryTitleColor: library.the_school_history_title_color,
            theSchoolHistoryBorderColor: library.the_school_history_border_color,
            theSchoolHistoryIconColor: library.the_school_history_icon_color,
            theSchoolHistoryBadgeColor: library.the_school_history_badge_color,
            theSchoolHistoryBackgroundTransparent: library.the_school_history_background_transparent,
            theSchoolHistoryBackgroundType: library.the_school_history_background_type,
            theSchoolHistoryBackgroundColor: library.the_school_history_background_color,
            theSchoolHistoryBackgroundImage: library.the_school_history_background_image,

            studentContentTitleColor: library.student_content_title_color,
            studentContentBorderColor: library.student_content_border_color,
            studentContentIconColor: library.student_content_icon_color,
            studentContentBadgeColor: library.student_content_badge_color,
            studentContentBackgroundTransparent: library.student_content_background_transparent,
            studentContentBackgroundType: library.student_content_background_type,
            studentContentBackgroundColor: library.student_content_background_color,
            studentContentBackgroundImage: library.student_content_background_image,
            mediaTitle: library.media_title,
            mediaTitleEn: library.media_title_en,
            mediaTitleMs: library.media_title_ms,
            schoolNewsBoardTitle: library.school_news_board_title,
            schoolNewsBoardTitleEn: library.school_news_board_title_en,
            schoolNewsBoardTitleMs: library.school_news_board_title_ms,
            teacherNotesTitle: library.teacher_notes_title,
            teacherNotesTitleEn: library.teacher_notes_title_en,
            teacherNotesTitleMs: library.teacher_notes_title_ms,
            learningMaterialTitle: library.learning_material_title,
            learningMaterialTitleEn: library.learning_material_title_en,
            learningMaterialTitleMs: library.learning_material_title_ms,
            theSchoolHistoryTitle: library.the_school_history_title,
            theSchoolHistoryTitleEn: library.the_school_history_title_en,
            theSchoolHistoryTitleMs: library.the_school_history_title_ms,
            studentContentTitleMs: library.student_content_title_ms,
            studentContentTitle: library.student_content_title,
            studentContentTitleEn: library.student_content_title_en,
          },
        };
      }
      return {
        success: false,
        error: 'Login failed',
        code: AuthenticationErrorCodes.CLICk400,
      };
    }
    return {
      success,
      error,
      code,
    };
  }
}
