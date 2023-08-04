import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared/models';
import { Capacitor } from '@capacitor/core';

export interface AudioDetail {
  mediaDetail: MediaDetailViewModel;
  audioElement: HTMLAudioElement;
  path: string | SafeUrl;
  duration?: number;
  title?: string;
  onStop?: () => void;
}
const initialAudioDetail: AudioDetail = {
  mediaDetail: null,
  audioElement: null,
  path: '',
  duration: 0,
  title: '',
  onStop: () => {},
};
@Injectable({ providedIn: 'root' })
export class MediaMusicService {
  private audioDetail: BehaviorSubject<AudioDetail> = new BehaviorSubject<
    AudioDetail
  >(initialAudioDetail);
  readonly audioDetail$: Observable<
    AudioDetail
  > = this.audioDetail.asObservable();

  constructor(private _sanitizer: DomSanitizer) {}

  public updateAudioDetail(nextAudioDetail: AudioDetail) {
    this.audioDetail.next(nextAudioDetail);
  }
  public setDuration(duration: number) {
    this.updateAudioDetail({
      ...this.audioDetail.value,
      duration,
    });
  }
  public setTitle(title: string) {
    this.updateAudioDetail({
      ...this.audioDetail.value,
      title,
    });
  }
  public setAudioElement(audioElement: HTMLAudioElement) {
    audioElement.addEventListener(
      'loadeddata',
      () => {
        if (audioElement.duration) {
          this.setDuration(audioElement.duration);
        }
      },
      false
    );
    this.updateAudioDetail({
      ...this.audioDetail.value,
      audioElement,
    });
  }

  public setMediaInformation(
    mediaDetail: MediaDetailViewModel,
    url: string,
    onStop?: () => void
  ) {
    this.updateAudioDetail({
      ...this.audioDetail.value,
      mediaDetail,
      path: this._sanitizer.bypassSecurityTrustUrl(
        Capacitor.convertFileSrc(url)
      ),
      onStop,
    });
  }
  public play() {
    this.audioDetail.value.audioElement.play();
  }
  public pause() {
    this.audioDetail.value.audioElement.pause();
  }

  public reload() {
    this.audioDetail.value.audioElement.load();
  }
  public stop() {
    const { onStop, audioElement } = this.audioDetail.value;
    if (audioElement) {
      if (onStop) {
        onStop();
      }
      audioElement.pause();
      audioElement.currentTime = 0;
      this.updateAudioDetail({
        ...this.audioDetail.value,
        path: '',
        mediaDetail: null,
        duration: 0,
        title: '',
        onStop: () => {},
      });
    }
  }
  public replay() {
    const audioEle = this.audioDetail.value.audioElement;
    if (audioEle) {
      audioEle.currentTime = 0;
    }
    audioEle.play();
  }
  isPlaying() {
    return !this.audioDetail.value.audioElement?.paused;
  }
}
