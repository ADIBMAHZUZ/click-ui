import { State, Selector, Action, StateContext, createSelector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { take, switchMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { AuthStateModel, initialState } from './auth-state.model';
import { Login, SetUserInfo, AlertError, Logout, UpdateProfile } from './auth.actions';
import { AuthService } from '../shared/services/auth.service';
import { LoginViewModel, HomeTitle } from '../shared/models';
import { CoreState, CoreStateModel, AddOfflineRequest } from 'src/app/core/store';
import { isEquals } from 'src/app/shared/utils';
import { NetworkService } from '@core-services';
import { AUTH_ENDPOINTS } from '../shared/auth.endpoints';

const titleMap = {
  library: 'mediaTitle',
  school_news: 'schoolNewsBoardTitle',
  teacher_notes: 'teacherNotesTitle',
  material: 'learningMaterialTitle',
  school_history: 'theSchoolHistoryTitle',
  student_content: 'studentContentTitle',
};
@State<AuthStateModel>({
  name: 'auth',
  defaults: initialState,
})
@Injectable()
export class AuthState {
  @Selector()
  static getUserInfo(state: AuthStateModel) {
    return state.userInfo;
  }
  @Selector()
  static getToken(state: AuthStateModel) {
    return state.userInfo?.token;
  }
  static getTitle(title: HomeTitle) {
    return createSelector([CoreState, AuthState], ([coreState, authState]: [CoreStateModel, AuthStateModel]) => {
      const language = coreState.language === 'ms' ? 'Ms' : 'En';
      return authState.userInfo.library[titleMap[title] + language];
    });
  }

  constructor(
    private _alertCtrl: AlertController,
    private _translate: TranslateService,
    private _apiService: AuthService,
    private _navCtrl: NavController,
    private _network: NetworkService,
    private _store: Store
  ) {}

  @Action(SetUserInfo)
  setUserInfo({ patchState }: StateContext<AuthStateModel>, { payload }: SetUserInfo) {
    patchState({
      userInfo: payload.userInfo,
    });
  }

  @Action(AlertError, { cancelUncompleted: true })
  async alertError(_, { payload }: AlertError) {
    const alertMessage = `LOGIN.${payload.errorCode}`;
    this._translate
      .get(alertMessage)
      .pipe(
        switchMap((msg) =>
          from(
            this._alertCtrl.create({
              header: msg.header,
              message: msg.message,
              cssClass: 'warning-alert',
            })
          )
        ),
        switchMap((alert) => alert.present()),
        take(1)
      )
      .subscribe();
  }

  @Action(Login, { cancelUncompleted: true })
  login(context: StateContext<AuthStateModel>, { payload }: Login) {
    const { username, password } = payload;
    return this._apiService.login(username, password).pipe(
      switchMap((loginVM) => {
        if (loginVM.success) {
          return context.dispatch(new SetUserInfo({ userInfo: loginVM as LoginViewModel })).pipe(
            tap(() => {
              this._navCtrl.navigateRoot('/home');
            })
          );
        }
        return context.dispatch(new AlertError({ errorCode: loginVM.code }));
      })
    );
  }

  @Action(Logout, { cancelUncompleted: true })
  logout(context: StateContext<AuthStateModel>) {
    const { getState } = context;
    const token = getState().userInfo.token.replace(/"/gi, '');
    if (!this._network.isConnected()) {
      this._store.dispatch(
        new AddOfflineRequest({
          request: {
            method: 'post',
            url: AUTH_ENDPOINTS.logout,
            body: { token },
          },
        })
      );
      return;
    }
    this._apiService
      .logout(token)
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          console.warn(error);
        },
      });
  }

  @Action(UpdateProfile, { cancelUncompleted: true })
  updateProfile({ getState, patchState }: StateContext<AuthStateModel>) {
    const preUserInfo = getState().userInfo;
    return this._apiService.getUserInfo().pipe(
      tap((userInfo) => {
        if (!isEquals(preUserInfo, userInfo)) {
          patchState({
            userInfo: userInfo as LoginViewModel,
          });
        }
      })
    );
  }
}
