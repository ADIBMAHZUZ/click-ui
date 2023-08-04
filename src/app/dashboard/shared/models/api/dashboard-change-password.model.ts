export interface ChangePasswordResponse {
  password: string;
  new_password: string;
  confirm_password: string;
  error: string;
  success: boolean;
}
