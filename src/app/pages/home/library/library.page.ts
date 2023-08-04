import { SetTabbarVisibility } from './../../../core/store/core.actions';
import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from 'src/app/core/store';
@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  @Select(CoreState.isTabbarVisible) isTabbarVisible$: Observable<boolean>;

  constructor(private _store: Store) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._store.dispatch([new SetTabbarVisibility(true)]);
  }
}
