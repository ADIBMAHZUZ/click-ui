import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Injectable({ providedIn: 'root' })
export class ScreenOrientationService {
  width: number;
  constructor(private _screenOrientation: ScreenOrientation, private _platform: Platform) {
    this.width = this._platform.width();
  }

  enableRotate() {
    this._screenOrientation.unlock();
  }

  disableRotate() {
    if (this.width > 600) {
      this._screenOrientation.lock(this._screenOrientation.ORIENTATIONS.LANDSCAPE);
    } else {
      this._screenOrientation.lock(this._screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
}
