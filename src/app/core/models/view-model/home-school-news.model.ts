export interface NewsDetailViewModel {
  id: string;
  title: string;
  content: string;
  photo: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  publishDate: string;
}

export interface SchoolNewsViewModel {
  count: number;
  next: string;
  previous: string;
  results: NewsDetailViewModel[];
}
