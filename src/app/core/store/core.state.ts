import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { initialState, CoreStateModel } from './core-state.model';
import {
  LoadLanguage,
  ResetSearchQuery,
  UpdateSearchQuery,
  AddOfflineRequest,
  SendOfflineRequests,
  SetNavbarVisibility,
  SetTabbarVisibility,
} from './core.actions';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isEquals, getOfflineRequestId } from 'src/app/shared/utils';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@State<CoreStateModel>({
  name: 'core',
  defaults: initialState,
})
@Injectable({ providedIn: 'root' })
export class CoreState {
  constructor(private _translate: TranslateService, private _store: Store, private _http: HttpClient) {}

  @Selector()
  static getLanguage(state: CoreStateModel) {
    return state.language;
  }
  @Selector()
  static getSearchQuery(state: CoreStateModel) {
    return state.searchQuery;
  }

  @Selector()
  static isNavbarVisible(state: CoreStateModel) {
    return state.ui.navbarVisibility;
  }

  @Selector()
  static isTabbarVisible(state: CoreStateModel) {
    return state.ui.tabbarVisibility;
  }
  @Action(LoadLanguage)
  loadLanguage(context: StateContext<CoreStateModel>, { payload }: LoadLanguage) {
    context.patchState({ language: payload.languageCode ?? 'en' });
    return this._translate.use(payload.languageCode);
  }

  @Action(UpdateSearchQuery)
  updateSearchQuery({ getState, patchState }: StateContext<CoreStateModel>, { payload }: UpdateSearchQuery) {
    const { searchQuery } = getState();
    if (isEquals(searchQuery, payload.query)) {
      return;
    }
    patchState({ searchQuery: payload.query });
  }
  @Action(ResetSearchQuery)
  resetSearchQuery(context: StateContext<CoreStateModel>) {
    const { searchQuery } = context.getState();
    if (isEquals(searchQuery, '')) {
      return;
    }
    return context.dispatch(new UpdateSearchQuery({ query: '' }));
  }

  @Action(AddOfflineRequest)
  AddOfflineRequest({ getState, patchState }: StateContext<CoreStateModel>, { payload }: AddOfflineRequest) {
    const newRequest = payload.request;
    const { offlineRequests } = getState();
    const id = getOfflineRequestId(newRequest);
    const request = offlineRequests[id];
    if (request) {
      return;
    }
    const isLogoutRequest = newRequest.url.includes('auth/logout');
    const token = this._store.selectSnapshot((state) => state.auth.userInfo.token);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const headers = isLogoutRequest
      ? defaultHeaders
      : {
          ...defaultHeaders,
          Authorization: `token ${token.replace(/"/gi, '')}`,
        };
    patchState({
      offlineRequests: {
        ...offlineRequests,
        [id]: { ...newRequest, headers },
      },
    });
  }

  @Action(SendOfflineRequests)
  sendOfflineRequests({ getState, patchState }: StateContext<CoreStateModel>) {
    const { offlineRequests } = getState();
    const requests = Object.values(offlineRequests);
    for (const request of requests) {
      const { url, method, headers = {}, body = {}, params = {} } = request;
      let observable = null;
      switch (method) {
        case 'get': {
          observable = this._http.get(url, { headers, params });
          break;
        }
        case 'post': {
          observable = this._http.post(url, body, { headers, params });
          break;
        }
      }
      observable.pipe(take(1)).subscribe();
    }
    patchState({ offlineRequests: {} });
  }

  @Action(SetNavbarVisibility)
  setNavbarVisibility({ patchState, getState }: StateContext<CoreStateModel>, { willShow }: SetNavbarVisibility) {
    patchState({ ui: { ...getState().ui, navbarVisibility: willShow } });
  }

  @Action(SetTabbarVisibility)
  setTabbarVisibility({ patchState, getState }: StateContext<CoreStateModel>, { willShow }: SetTabbarVisibility) {
    patchState({ ui: { ...getState().ui, tabbarVisibility: willShow } });
  }
}
