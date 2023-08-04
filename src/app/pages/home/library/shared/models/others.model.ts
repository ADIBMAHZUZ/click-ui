export enum BorrowErrorCodes {
  // Media does not found
  CLICk410 = 'CLICk410',
  // Library does not have this media
  CLICk411 = 'CLICk411',
  // This book is out of stock
  CLICk412 = 'CLICk412',
  // Reach to limit borrow
  CLICk413 = 'CLICk413',
  // Expiration time invalid
  CLICk414 = 'CLICk414',
  // You have borrowed this media
  CLICk415 = 'CLICk415',
}
export interface LocalPath {
  directory: string;
  name: string;
}
