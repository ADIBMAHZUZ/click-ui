import { HttpHeaders, HttpParams } from '@angular/common/http';

export enum MediaType {
  BOOK = 'book',
  AUDIO = 'audio',
  VIDEO = 'video',
  TEXT = 'text',
}
export interface Paging<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface Successable {
  success: boolean;
  error?: string;
}

export interface Bookmarkable {
  bookmarks?: number[];
}
export type LanguageCode = 'en' | 'ms';

export interface Request {
  method: 'post' | 'get';
  url: string;
  headers?: HttpHeaders;
  body?: any;
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
}
