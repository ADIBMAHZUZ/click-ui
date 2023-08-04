import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CheckForgotPasswordTokenParams,
  CreateNewPasswordParams,
  ForgotPasswordParams,
  ForgotPasswordResponse,
  LoginResponse,
  LoginViewModel,
  LoginErrorable,
} from '../models';
import { Converter } from './converter.service';
import { AUTH_ENDPOINTS } from '../auth.endpoints';
import { Successable } from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _converter: Converter) {}

  checkForgotPasswordToken(params: CheckForgotPasswordTokenParams): Observable<ForgotPasswordResponse> {
    return this._http.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.checkForgotPasswordToken, params);
  }

  createNewPassword(params: CreateNewPasswordParams): Observable<ForgotPasswordResponse> {
    return this._http.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.createNewPassword, params);
  }

  forgotPassword(params: ForgotPasswordParams): Observable<ForgotPasswordResponse> {
    return this._http.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, params);
  }

  login(username: string, password: string): Observable<LoginViewModel | LoginErrorable> {
    return this._http
      .post<LoginResponse>(AUTH_ENDPOINTS.login, {
        username,
        password,
        device: 'mobile',
      })
      .pipe(map((loginResponse) => this._converter.fromLoginResponse__LoginViewModel(loginResponse)));
  }

  logout(token: string): Observable<Successable> {
    return this._http.post<Successable>(AUTH_ENDPOINTS.logout, {
      token,
    });
  }

  getUserInfo(): Observable<LoginViewModel | LoginErrorable> {
    return this._http
      .get<LoginResponse>(AUTH_ENDPOINTS.profileInfo, {})
      .pipe(map((response) => this._converter.fromLoginResponse__LoginViewModel(response)));
  }
}
