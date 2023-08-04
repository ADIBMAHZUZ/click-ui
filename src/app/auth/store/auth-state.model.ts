import { LoginViewModel } from '../shared/models';

export interface AuthStateModel {
  userInfo: LoginViewModel;
}

export const initialState: AuthStateModel = {
  userInfo: null,
};
