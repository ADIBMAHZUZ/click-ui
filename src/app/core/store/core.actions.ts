import { LanguageCode, Request } from '../models';

const enum Actions {
  LOAD_LANGUAGE = '[Core] Load Language',
  UPDATE_SEARCH_QUERY = '[Core] Update Search Query',
  RESET_SEARCH_QUERY = '[Core] Reset Search Query',
  ADD_OFFLINE_REQUEST = '[Core] Add Offline Request',
  SEND_OFFLINE_REQUESTS = '[Core] Send Offline Requests',
  SET_NAVBAR_VISIBILITY = '[Core] Set Navbar Visibility',
  SET_TABBAR_VISIBILITY = '[Core] Set Tabbar Visibility',
}

export class LoadLanguage {
  static readonly type = Actions.LOAD_LANGUAGE;
  constructor(public readonly payload: { languageCode: LanguageCode }) {}
}

export class UpdateSearchQuery {
  static readonly type = Actions.UPDATE_SEARCH_QUERY;
  constructor(public readonly payload: { query: string }) {}
}

export class ResetSearchQuery {
  static readonly type = Actions.RESET_SEARCH_QUERY;
}

export class AddOfflineRequest {
  static readonly type = Actions.ADD_OFFLINE_REQUEST;
  constructor(public readonly payload: { request: Request }) {}
}
export class SendOfflineRequests {
  static readonly type = Actions.SEND_OFFLINE_REQUESTS;
}

export class SetNavbarVisibility {
  static readonly type = Actions.SET_NAVBAR_VISIBILITY;
  constructor(public readonly willShow: boolean) {}
}

export class SetTabbarVisibility {
  static readonly type = Actions.SET_TABBAR_VISIBILITY;
  constructor(public readonly willShow: boolean) {}
}
