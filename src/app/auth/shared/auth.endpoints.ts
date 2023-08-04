import { environment } from 'src/environments/environment';

const { API_URL } = environment;

const auth = `${API_URL}auth/`;
const authLogin = `${auth}login/`;
const authLogout = `${auth}logout/`;
const authForgotPassword = `${auth}forgot-password/`;
const authCheckForgotPasswordToken = `${auth}check-forgot-password-token/`;
const authCreateNewPassword = `${auth}create-new-password/`;
const profileInfo = `${API_URL}subscriber/profile/`;

export const AUTH_ENDPOINTS = {
  auth,
  login: authLogin,
  logout: authLogout,
  forgotPassword: authForgotPassword,
  checkForgotPasswordToken: authCheckForgotPasswordToken,
  createNewPassword: authCreateNewPassword,
  profileInfo,
};
