import { SubSink } from 'subsink';
import { ModalController, IonRange } from '@ionic/angular';
import {
  AudioDetail,
  MediaMusicService,
} from 'src/app/core/services/media-music.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-audio-view',
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
})
export class AudioViewComponent implements OnInit, OnDestroy {
  @ViewChild(IonRange) rangeElement: IonRange;

  subSink = new SubSink();
  audioDetail: AudioDetail;
  currentTime: number;
  duration: number;

  constructor(
    private mediaMusicService: MediaMusicService,
    private modalController: ModalController
  ) {}
  ngOnInit() {
    this.subSink.sink = this.mediaMusicService.audioDetail$
      .pipe(
        tap((detail) => {
          this.audioDetail = detail;
          this.currentTime = Math.round(
            this.audioDetail.audioElement.currentTime
          );

          this.subSink.sink = fromEvent(
            this.audioDetail.audioElement,
            'timeupdate'
          ).subscribe((_) => {
            this.currentTime = Math.round(
              this.audioDetail.audioElement.currentTime
            );
          });
        })
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
  togglePlayer(pause) {
    if (pause) {
      this.mediaMusicService.play();
    } else {
      this.mediaMusicService.pause();
    }
  }

  play() {
    this.mediaMusicService.play();
  }

  pause() {
    this.mediaMusicService.pause();
  }

  async stop() {
    await this.modalController.dismiss();
    this.mediaMusicService.stop();
  }
  replay() {
    this.mediaMusicService.replay();
  }
  async openViewPlayer() {
    const modal = await this.modalController.create({
      component: AudioViewComponent,
      swipeToClose: true,
      cssClass: 'my-custom-modal-css',
    });
    await modal.present();
  }
  toHHMMSS(secs: number): string {
    return new Date(secs * 1000).toISOString().substr(11, 8);
  }
  updateCurrentTime() {
    this.audioDetail.audioElement.currentTime = parseInt(
      this.rangeElement.value.toString(),
      10
    );
  }
}
