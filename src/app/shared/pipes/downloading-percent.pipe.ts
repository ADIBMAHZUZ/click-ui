import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'downloadingPercent' })
export class DownloadingPercentPipe implements PipeTransform {
  transform(downloading: { totalSize: number; downloadedSize: number }): number {
    if (!downloading) {
      return 0;
    }
    const { downloadedSize = 0, totalSize = 1 } = downloading;
    return downloadedSize / totalSize;
  }
}
