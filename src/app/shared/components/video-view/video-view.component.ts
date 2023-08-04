import { Component, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { ElectronService } from 'ngx-electron';
import { ScreenOrientationService } from '../../service/screen-orientation.service';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss'],
})
export class VideoViewComponent implements OnDestroy {
  @ViewChild('myvideo') myVideo: ElementRef<HTMLVideoElement>;
  @Input() path: string;
  @Input() source: SafeUrl;

  constructor(
    private _sanitizer: DomSanitizer,
    private _screenOrientationService: ScreenOrientationService,
    private _electron: ElectronService
  ) {}

  async ionViewDidEnter() {
    try {
      if (Capacitor.getPlatform() == 'android') {
        this._screenOrientationService.enableRotate();
      }
      if (!this._electron.isElectronApp) {
        this.path = Capacitor.convertFileSrc(this.path);
      }
      this.source = this._sanitizer.bypassSecurityTrustUrl(this.path);

      await this.myVideo.nativeElement.play();
    } catch (err) {
      console.warn(err);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this._screenOrientationService.disableRotate();
  }
}
