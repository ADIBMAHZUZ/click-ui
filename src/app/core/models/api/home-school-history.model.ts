export interface HistoryDetailResponse {
  id: string;
  title: string;
  content: string;
  photo: string;
  created_by: number;
  updated_by: number;
  is_active: boolean;
  publish_date: string;
}

export interface SchoolHistoryResponse {
  count: number;
  next: string;
  previous: string;
  results: HistoryDetailResponse[];
}
