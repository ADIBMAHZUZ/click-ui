import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentDetailViewModel } from 'src/app/core/models';
import { StudentContentService } from '../student-content.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.page.html',
  styleUrls: ['./content-detail.page.scss'],
})
export class ContentDetailPage {
  contentDetail: ContentDetailViewModel;
  private _subSink = new SubSink();

  @ViewChild('content') content: ElementRef;

  constructor(private route: ActivatedRoute, private studentContentService: StudentContentService) {}

  public ionViewWillEnter() {
    this._subSink.sink = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.studentContentService.getContentById(id).subscribe((contentDetail) => {
        this.contentDetail = contentDetail;
        this.content.nativeElement.innerHTML = contentDetail?.content;
      });
    });
  }

  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }
}
