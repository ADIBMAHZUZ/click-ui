import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AUTH_ENDPOINTS } from 'src/app/auth/shared/auth.endpoints';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Logout } from 'src/app/auth/store/auth.actions';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _alertCtrl: AlertController
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let modifiedReq: HttpRequest<any> = request;
    const hasOfflineRequest = !!request.headers.get('Authorization');
    if (!hasOfflineRequest) {
      let headers = request.headers.set('Content-Type', 'application/json');
      const token = this._store.selectSnapshot(AuthState.getToken);
      if (!modifiedReq.url.includes(AUTH_ENDPOINTS.auth) && token) {
        headers = headers.set(
          'Authorization',
          `token ${token.replace(/"/gi, '')}`
        );
      }
      modifiedReq = request.clone({
        headers,
      });
    }
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this._translateService
            .get('LOGIN.TOKEN_EXPIRED')
            .toPromise()
            .then((TOKEN_EXPIRED) =>
              this._alertCtrl.create({
                header: TOKEN_EXPIRED.header,
                message: TOKEN_EXPIRED.message,
                cssClass: 'warning-alert',
              })
            )
            .then((warningAlert) => warningAlert.present())
            .then(() => {
              this._store.dispatch(new Logout());
            });
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }
}
