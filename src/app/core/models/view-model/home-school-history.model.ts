export interface HistoryDetailViewModel {
  id: string;
  title: string;
  content: string;
  photo: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  publishDate: string;
}

export interface SchoolHistoryViewModel {
  count: number;
  next: string;
  previous: string;
  results: HistoryDetailViewModel[];
}
