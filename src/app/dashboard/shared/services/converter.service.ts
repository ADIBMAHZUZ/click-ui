import { Injectable } from '@angular/core';
import {
  ActivityDetailResponse,
  ActivityDetailViewModel,
  AccountInfoResponse,
  AccountInfoViewModel,
  ActivityDetailType,
  ActivityDetailViewModelType,
  ChangePasswordViewModel,
  ChangePasswordResponse,
  DashboardResponse,
  DashboardViewModel,
} from '../models';

@Injectable({ providedIn: 'root' })
export class Converter {
  fromActivityDetailType__ActivityDetailViewModel(
    activityDetailResponse: ActivityDetailType
  ): ActivityDetailViewModelType {
    const { id, date, media, action } = activityDetailResponse;
    return {
      id,
      date,
      media,
      action,
    };
  }

  fromActivityDetailResponse__ActivityDetailViewModel(
    activityDetailResponse: ActivityDetailResponse
  ): ActivityDetailViewModel {
    const { results } = activityDetailResponse;
    const resultsVM = results.map((contentDetail) =>
      this.fromActivityDetailType__ActivityDetailViewModel(contentDetail)
    );
    return {
      results: resultsVM,
    };
  }

  fromAccountInfoResponse__AccountInfoViewModel(
    accountInfoResponse: AccountInfoResponse
  ): AccountInfoViewModel {
    const {
      id,
      username,
      email,
      name,
      short_name,
      address,
      phone,
      logo,
    } = accountInfoResponse;
    return {
      id,
      username,
      email,
      name,
      shortName: short_name,
      address,
      phone,
      logo,
    };
  }

  fromChangePasswordResponse__ChangePasswordViewModel(
    changePasswordResponse: ChangePasswordResponse
  ): ChangePasswordViewModel {
    const {
      password,
      new_password,
      confirm_password,
      error,
      success,
    } = changePasswordResponse;
    return {
      password,
      newPassword: new_password,
      confirmPassword: confirm_password,
      error,
      success,
    };
  }

  fromDashboardResponse__DashboardViewModel(
    dashboardResponse: DashboardResponse
  ): DashboardViewModel {
    const { results } = dashboardResponse;
    return {
      results,
    };
  }
}
