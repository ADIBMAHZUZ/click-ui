import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsDetailViewModel } from 'src/app/core/models';
import { SchoolNewsBoardService } from './../school-news.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage {
  newDetail: NewsDetailViewModel;
  private _subSink = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private schoolNewsBoardService: SchoolNewsBoardService
  ) {}

  public ionViewWillEnter() {
    this._subSink.sink = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.schoolNewsBoardService.getNewsById(id).subscribe((newDetail) => {
        this.newDetail = newDetail;
      });
    });
  }

  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }
}
