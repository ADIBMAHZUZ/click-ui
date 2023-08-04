import { ModalController } from '@ionic/angular';
import {
  MediaMusicService,
  AudioDetail,
} from 'src/app/core/services/media-music.service';
import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { SubSink } from 'subsink';
import { AudioViewComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-music-fab',
  templateUrl: './music-fab.component.html',
  styleUrls: ['./music-fab.component.css'],
})
export class MusicFabComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myAudio') public myAudio: ElementRef<HTMLAudioElement>;

  public audioDetail: AudioDetail;
  public subSink = new SubSink();

  constructor(
    private mediaMusicService: MediaMusicService,
    private modalController: ModalController
  ) {}

  public ngAfterViewInit() {
    this.mediaMusicService.setAudioElement(this.myAudio.nativeElement);
  }

  public ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public ngOnInit() {
    this.subSink.sink = this.mediaMusicService.audioDetail$.subscribe(
      (detail) => {
        this.audioDetail = detail;
      }
    );
  }

  public async openViewPlayer() {
    const modal = await this.modalController.create({
      component: AudioViewComponent,
      swipeToClose: true,
      cssClass: 'my-custom-modal-css',
    });
    modal.present();
  }

  public pause() {
    this.mediaMusicService.pause();
  }

  public play() {
    this.mediaMusicService.play();
  }

  public stopPlaying() {
    this.mediaMusicService.stop();
  }

  public toHHMMSS(secs): string {
    const secNum = parseInt(secs, 10);
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;

    return [minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i >= 0)
      .join(':');
  }

  public togglePlayer(pause) {
    if (pause) {
      this.mediaMusicService.play();
    } else {
      this.mediaMusicService.pause();
    }
  }
}
