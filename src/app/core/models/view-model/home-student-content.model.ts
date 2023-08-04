export interface ContentDetailViewModel {
  id: string;
  title: string;
  content: string;
  photo: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  publishDate: string;
}

export interface StudentContentViewModel {
  count: number;
  next: string;
  previous: string;
  results: ContentDetailViewModel[];
}
