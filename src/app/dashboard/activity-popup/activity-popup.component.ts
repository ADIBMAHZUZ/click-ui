import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivityAction } from '../shared';

@Component({
  selector: 'app-activity-popup',
  templateUrl: './activity-popup.component.html',
  styleUrls: ['./activity-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPopupComponent {
  @Input() date: string;
  @Input() mediaName: string;
  @Input() action: ActivityAction;

  getBackgroundColor(action: ActivityAction) {
    switch (action) {
      case 'borrow':
        return 'success';
      case 'return':
        return 'danger';
      case 'extend':
        return 'primary';
    }
  }
}
