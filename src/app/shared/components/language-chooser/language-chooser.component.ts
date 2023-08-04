import { Component } from '@angular/core';
import { LoadLanguage } from 'src/app/core/store/core.actions';
import { Store, Select } from '@ngxs/store';
import { CoreState } from 'src/app/core/store/core.state';
import { Observable } from 'rxjs';
import { LanguageCode } from 'src/app/core/models';

@Component({
  selector: 'app-language-chooser',
  templateUrl: './language-chooser.component.html',
  styleUrls: ['./language-chooser.component.scss'],
})
export class LanguageChooserComponent {
  @Select(CoreState.getLanguage) language$: Observable<LanguageCode>;
  constructor(private _store: Store) {}

  useLanguage(language: string) {
    this._store.dispatch(
      new LoadLanguage({ languageCode: language as LanguageCode })
    );
  }
}
