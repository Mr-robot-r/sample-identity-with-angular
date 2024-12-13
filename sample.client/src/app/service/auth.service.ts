import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, pipe, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = '/api/auth/';
  //url = 'http://localhost:3600/api/';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly JWT_REFRESH_TOKEN = 'JWT_REFRESH_TOKEN';
  private readonly USER = 'USER';
  private readonly USERID = 'USERID';
  private helper = new JwtHelperService();
  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToastService
  ) {}
  login(user:any) {
    return this.http.post<any>(`${this.url}login`, user).pipe(
      tap((tokens) => {
        if (tokens) {
          return this.doLoginUser(tokens);
        }
      }),
      pipe(catchError(this.handleError.bind(this)))
    );
  }
  register(user:any) {
    return this.http.post<any>(`${this.url}register`, user).pipe(
      tap((tokens) => {
        if (tokens) {
          return this.doLoginUser(tokens);
        }
      }),
      pipe(catchError(this.handleError.bind(this)))
    );
  }
  logout() {
    this.doLogoutUser();
    this.router.navigateByUrl('/auth/login');
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http
      .post<any>(this.url + 'refreshToken', {
        refreshtoken: localStorage.getItem(this.JWT_REFRESH_TOKEN),
      })
      .pipe(
        tap((tokens: any) => {
          this.storeTokensRefresh(tokens);
          this.storeToken(tokens);
        }),
        pipe(catchError(this.handleError.bind(this)))
      );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(tokens:any) {
    localStorage.setItem(this.USER, JSON.stringify(tokens.user));
    localStorage.setItem(this.USERID, tokens.id);
    this.storeToken(tokens);
    this.storeTokensRefresh(tokens);
  }

  private doLogoutUser() {
    this.removeTokens();
  }

  private storeToken(token: any) {
    localStorage.setItem(this.JWT_TOKEN, token.accessToken);
  }
  private storeTokensRefresh(token: any) {
    localStorage.setItem(this.JWT_REFRESH_TOKEN, token.refreshToken);
  }
  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.JWT_REFRESH_TOKEN);
    localStorage.removeItem(this.USER);
    localStorage.removeItem(this.USERID);
    localStorage.removeItem('UNITBYUSERID');
    localStorage.removeItem('USERIDSELECTED');
    localStorage.removeItem('OwnerUser');
    localStorage.removeItem('unitSelectedInfo');
    localStorage.removeItem('permission');
  }
  public getToken() {
    return this.helper.decodeToken(localStorage.getItem(this.JWT_TOKEN)!);
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error);

    let errormessages = '';

    if (error.status == 422) {
      if (error.error.errors) {
        Object.keys(error.error.errors).forEach((element) => {
          errormessages += error.error.errors[element];
        });
      }
      this.toaster.makeToast(
        'toast-error',
        'خطا در مقادیر ورودی',
        errormessages
      );
    }
    if (error.status == 403) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'شما اجازه دسترسی به این صفحه را ندارید'
      );
    }
    if (error.status == 400) {
      this.toaster.makeToast('toast-error', 'خطا', error.error.message);
    }
    if (error.status == 404) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'داده ای با این اطلاعات پیدا نشد'
      );
    }
    if (error.status == 500) {
      this.toaster.makeToast('toast-error', 'خطا', ' خطا در سرور ');
    }
    if (error.status == 429) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'تعداد درخواست شما بیش از اندازه میباشد لطفا چند دقیقه صبر کنید دوباره تلاش کنید'
      );
    }
    if (error.status == 0) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'مشکل در برقراری اتصال با سرور'
      );
    }
    return throwError('خطایی رخ داد .');
  }
}
