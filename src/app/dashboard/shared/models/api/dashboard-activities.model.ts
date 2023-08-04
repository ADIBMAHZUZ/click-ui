import { ActivityAction } from '.';

export interface ActivitiesResponse {
  category: string;
  media_type: string;
  from_date: string;
  to_date: string;
  results: ActivityDetailType[];
}

export interface ActivityDetailType {
  id: string;
  date: string;
  media: string;
  action: ActivityAction;
}

export interface ActivityDetailResponse {
  results: ActivityDetailType[];
}
