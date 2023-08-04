import { Successable } from '../../../core/models/others';
import { AuthenticationErrorCodes } from './others.model';

export interface Errorable {
  error?: string;
}

export interface LoginErrorable {
  // error: string;
  code: AuthenticationErrorCodes;
  success: boolean;
}
export interface ForgotPasswordResponse extends Successable, Errorable {}

export interface LoginResponse extends Successable, LoginErrorable {
  user_id: string;
  username: string;
  email: string;
  token: string;
  name: string;
  short_name: string;
  user_type: string;
  max_download: number;
  max_borrow_duration: number;
  logo: string;
  library: {
    id: string;
    logo: string;
    name: string;
    short_name: string;
    created: string;
    modified: string;
    is_active: boolean;
    entire_background_type: string;
    entire_background_image: string;
    entire_background_color: string;
    media_title_color: string;
    media_border_color: string;
    media_badge_color: string;
    media_icon_color: string;
    media_background_transparent: string;
    media_background_type: string;
    media_background_color: string;
    media_background_image: string;
    school_news_board_title_color: string;
    school_news_board_border_color: string;
    school_news_board_badge_color: string;
    school_news_board_icon_color: string;
    school_news_board_background_transparent: string;
    school_news_board_background_type: string;
    school_news_board_background_color: string;
    school_news_board_background_image: string;
    teacher_notes_title_color: string;
    teacher_notes_border_color: string;
    teacher_notes_badge_color: string;
    teacher_notes_icon_color: string;
    teacher_notes_background_transparent: string;
    teacher_notes_background_type: string;
    teacher_notes_background_color: string;
    teacher_notes_background_image: string;
    learning_material_title_color: string;
    learning_material_border_color: string;
    learning_material_badge_color: string;
    learning_material_icon_color: string;
    learning_material_background_transparent: string;
    learning_material_background_type: string;
    learning_material_background_color: string;
    learning_material_background_image: string;
    the_school_history_title_color: string;
    the_school_history_border_color: string;
    the_school_history_icon_color: string;
    the_school_history_badge_color: string;
    the_school_history_background_transparent: string;
    the_school_history_background_type: string;
    the_school_history_background_color: string;
    the_school_history_background_image: string;
    student_content_title_color: string;
    student_content_border_color: string;
    student_content_icon_color: string;
    student_content_badge_color: string;
    student_content_background_transparent: string;
    student_content_background_type: string;
    student_content_background_color: string;
    student_content_background_image: string;
    media_title: string;
    media_title_en: string;
    media_title_ms: string;
    school_news_board_title: string;
    school_news_board_title_en: string;
    school_news_board_title_ms: string;
    teacher_notes_title: string;
    teacher_notes_title_en: string;
    teacher_notes_title_ms: string;
    learning_material_title: string;
    learning_material_title_en: string;
    learning_material_title_ms: string;
    the_school_history_title: string;
    the_school_history_title_en: string;
    the_school_history_title_ms: string;
    student_content_title: string;
    student_content_title_en: string;
    student_content_title_ms: string;
  };
}
export interface ForgotPasswordParams {
  username: string;
  email: string;
}
export interface CreateNewPasswordParams {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface CheckForgotPasswordTokenParams {
  token: string;
}
