import { ActivityAction } from '../api';

export interface ActivitiesViewModel {
  category: string;
  mediaType: string;
  fromDate: string;
  toDate: string;
  results: ActivityDetailViewModelType[];
}

export interface ActivityDetailViewModelType {
  id: string;
  date: string;
  media: string;
  action: ActivityAction;
}

export interface OptionsTypeItem {
  name: string;
  value: string;
}

export interface ActivityDetailViewModel {
  results: ActivityDetailViewModelType[];
}

export type ActivityCategories = {
  id: string;
  name: string;
}[];
