import { LanguageCode, Request } from '../models';

export interface CoreStateModel {
  language: LanguageCode;
  searchQuery: string;
  offlineRequests: {
    [key: string]: Request;
  };
  ui: {
    navbarVisibility: boolean;
    tabbarVisibility: boolean;
  };
}
export const initialState: CoreStateModel = {
  language: 'en',
  searchQuery: '',
  offlineRequests: {},
  ui: {
    navbarVisibility: true,
    tabbarVisibility: true,
  },
};
