import { MediaType, Request } from 'src/app/core/models';
import { ONE_DAY_AS_MILLISECONDS, ONE_HOUR_AS_MILLISECONDS, ONE_MIN_AS_MILLISECONDS } from 'src/app/pages/home/library/shared';

export function getDistanceFromTop(element: HTMLElement) {
  if (element) {
    return window.pageYOffset + element.getBoundingClientRect().top;
  }
  return null;
}

export function getFileExtension(mediaType: MediaType): string {
  const extensionOf = {
    [MediaType.BOOK]: 'pdf',
    [MediaType.AUDIO]: 'mp3',
    [MediaType.VIDEO]: 'mp4',
  };

  return extensionOf[mediaType] ?? 'Unknown file type';
}

export function isEquals(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getOfflineRequestId(request: Request): number {
  const input = JSON.stringify(request);
  let output = 0;
  let leng = input.length;
  for (let i = 0; i < leng; i++) {
    output += input[i].charCodeAt(0);
  }
  return output;
}

export function getRemainingTime(expirationTime: string): { days: number; hours: number; minutes: number } {
  if (expirationTime) {
    const remainingTime = new Date(expirationTime).getTime() - new Date().getTime();

    if (remainingTime < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
      };
    }

    const remainingTimeAfterOffset = remainingTime + ONE_MIN_AS_MILLISECONDS; // +1 min for displaying purpose.
    const days = Math.floor(remainingTimeAfterOffset / ONE_DAY_AS_MILLISECONDS);
    const hours = Math.floor((remainingTimeAfterOffset - days * ONE_DAY_AS_MILLISECONDS) / ONE_HOUR_AS_MILLISECONDS);
    const minutes = Math.floor(
      (remainingTimeAfterOffset - days * ONE_DAY_AS_MILLISECONDS - hours * ONE_HOUR_AS_MILLISECONDS) / ONE_MIN_AS_MILLISECONDS
    );
    return {
      days,
      hours,
      minutes,
    };
  }
  return {
    days: 0,
    hours: 0,
    minutes: 0,
  };
}
