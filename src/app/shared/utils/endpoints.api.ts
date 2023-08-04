import { environment } from 'src/environments/environment';

const { API_URL } = environment;

/********** Media **********/

const media = `${API_URL}media/`;
const mediaSubcriber = `${API_URL}media/subscriber/`;
const mediaFavorite = `${API_URL}media/favorite/`;
export const MEDIA_ENDPOINTS = {
  media,
  mediaSubcriber,
  mediaFavorite,
};

/******************************/

/********** School News Board **********/

const schoolNewsBoard = `${API_URL}school_news_board/`;

export const SCHOOL_NEWS_BOARD_ENDPOINTS = {
  schoolNewsBoard,
};

/********** School History **********/

const schoolHistory = `${API_URL}school_history/`;

export const SCHOOL_HISTORY_ENDPOINTS = {
  schoolHistory,
};
/******************************/

/********** Student Content **********/

const studentContent = `${API_URL}student_content/mobile/`;

export const STUDENT_CONTENT_ENDPOINTS = {
  studentContent,
};
/******************************/

/********** Learning material **********/

const learningMaterial = `${API_URL}learning_material/`;
const learningMaterialCategories = `${API_URL}learning_material/get/`;
const learningMaterialCategory = `${API_URL}learning_material/category/`;
const learningMaterialDownloaded = `${API_URL}learning_material/downloaded/`;
export const LEARNING_MATERIAL_ENDPOINTS = {
  learningMaterial,
  learningMaterialCategories,
  learningMaterialCategory,
  learningMaterialDownloaded,
};
/******************************/
/********** Dashboard **********/
const dashboardActivities = `${API_URL}statistics/dashboard_activities/`;
const dashboardUserInfo = `${API_URL}users/profile/`;
const dashboardUserChangePassword = `${API_URL}users/change-password/`;

export const DASHBOARD = {
  dashboardActivities,
  dashboardUserInfo,
  dashboardUserChangePassword,
};
/******************************/
