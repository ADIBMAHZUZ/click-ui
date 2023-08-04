import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryDetailViewModel } from 'src/app/core/models';
import { SchoolHistoryService } from './../school-history.service';
import { SubSink } from 'subsink';
import { map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
})
export class HistoryDetailPage {
  historyDetail: HistoryDetailViewModel;
  private _subSink = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private schoolHistoryService: SchoolHistoryService
  ) {}

  public ionViewWillEnter() {
    this._subSink.sink = this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => this.schoolHistoryService.getHistoryById(id))
      )
      .subscribe((historyDetail) => {
        this.historyDetail = historyDetail;
      });
  }

  public ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }
}
