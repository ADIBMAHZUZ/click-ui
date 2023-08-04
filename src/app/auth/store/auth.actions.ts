import { LoginViewModel, AuthenticationErrorCodes } from '../shared/models';

const enum Actions {
  LOGIN = '[Auth] Login',
  SET_USER_INFO = '[Auth] Set User Information',
  ALERT_ERROR = '[Auth] Alert Error',
  LOGOUT = '[Auth] Logout',
  UPDATE_PROFILE = '[Auth] Update Profile',
}
export class Login {
  static readonly type = Actions.LOGIN;
  constructor(
    public readonly payload: { username: string; password: string }
  ) {}
}

export class SetUserInfo {
  static readonly type = Actions.SET_USER_INFO;
  constructor(public readonly payload: { userInfo: LoginViewModel }) {}
}

export class AlertError {
  static readonly type = Actions.ALERT_ERROR;
  constructor(
    public readonly payload: { errorCode: AuthenticationErrorCodes }
  ) {}
}

export class Logout {
  static readonly type = Actions.LOGOUT;
}

export class UpdateProfile {
  static readonly type = Actions.UPDATE_PROFILE;
}
