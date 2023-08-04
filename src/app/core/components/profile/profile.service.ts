import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DASHBOARD } from 'src/app/shared/utils/endpoints.api';
import {
  DashboardViewModel,
  DashboardResponse,
} from 'src/app/dashboard/shared/models';
import { Converter } from 'src/app/dashboard/shared';

@Injectable({ providedIn: 'root' })
export class DashboardInfoService {
  constructor(private httpClient: HttpClient, private converter: Converter) {}

  getDashboardInfo(): Observable<DashboardViewModel> {
    return this.httpClient
      .get<DashboardResponse>(DASHBOARD.dashboardActivities)
      .pipe(
        map((response: DashboardResponse) =>
          this.converter.fromDashboardResponse__DashboardViewModel(response)
        )
      );
  }
}
