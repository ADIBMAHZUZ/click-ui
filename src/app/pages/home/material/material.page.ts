import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from 'src/app/core/store';

@Component({
  selector: 'app-material',
  templateUrl: './material.page.html',
  styleUrls: ['./material.page.scss'],
})
export class MaterialPage {
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;
}
