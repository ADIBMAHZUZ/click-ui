import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string;
  @Input() custom: boolean;
  @Input() isShowBackButton = true;
  @Output() back: EventEmitter<any> = new EventEmitter();

  handleBack() {
    this.back.emit();
  }
}
