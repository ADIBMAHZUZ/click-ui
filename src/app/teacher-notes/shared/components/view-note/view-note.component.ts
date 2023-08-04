import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.css'],
})
export class ViewNoteComponent {
  @Input() title: string;
  @Input() content: string;
}
