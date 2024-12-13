import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  //url = 'http://localhost:3600/api/';
  url = '/api/';

  constructor(private http: HttpClient, private toaster: ToastService) {}
  public getDataWithPagination(
    route: string,
    body: any,
    limit: string,
    page: string
  ) {
    route = `${route}`;
    route.trim();
    return this.http
      .post(this.createCompleteRoute(route, this.url), body, {
        params: { limit, page },
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
  public getData(route: string) {
    route = `${route}`;
    route.trim();
    return this.http
      .get(this.createCompleteRoute(route, this.url))
      .pipe(catchError(this.handleError.bind(this)));
  }
  public getFileData(route: string) {
    route = `${route}`;
    route.trim();
    return this.http
      .get(this.createCompleteRoute(route, this.url), {
        responseType: 'blob' as 'json',
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
  public getDataById(route: string) {
    route = route.trim();
    return this.http
      .get(this.createCompleteRoute(route, this.url))
      .pipe(catchError(this.handleError.bind(this)));
  }
  public postData(route: string, body: any) {
    return this.http
      .post(
        this.createCompleteRoute(route, this.url),
        body,
        this.generateHeaders(null)
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
  public postDataFiles(route: string, body: any) {
    return this.http
      .post(this.createCompleteRoute(route, this.url), body, {
        responseType: 'json',
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
  public update(route: string, body: any) {
    return this.http
      .put(
        this.createCompleteRoute(route, this.url),
        body,
        this.generateHeaders(null)
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
  public delete(route: string) {
    return this.http
      .delete(this.createCompleteRoute(route, this.url))
      .pipe(catchError(this.handleError.bind(this)));
  }

  private createCompleteRoute(route: string, envAddress: string) {
    return `${envAddress}${route}`;
  }
  private generateHeaders(token: null) {
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      };
    } else {
      return {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
    }
  }
  private handleError(error: HttpErrorResponse) {
    let errormessages = '';

    if (error.status === 422) {
      console.log(error);

      if (error.error) {
        Object.keys(error.error).forEach((element) => {
          errormessages += error.error[element];
        });
      }
      this.toaster.makeToast(
        'toast-error',
        'خطا در مقادیر ورودی',
        errormessages
      );
    }
    if (error.status === 403) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'شما اجازه دسترسی به این صفحه را ندارید'
      );
    }
    if (error.status === 400) {
      this.toaster.makeToast('toast-error', 'خطا', error.error.message);
    }
    if (error.status === 404) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'داده ای با این اطلاعات پیدا نشد'
      );
    }
    if (error.status === 429) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'تعداد درخواست شما بیش از اندازه میباشد لطفا چند دقیقه صبر کنید دوباره تلاش کنید'
      );
    }
    if (error.status === 500) {
      this.toaster.makeToast('toast-error', 'خطا', ' خطا در سرور ');
    }
    if (error.status === 0) {
      this.toaster.makeToast(
        'toast-error',
        'خطا',
        'مشکل در برقراری اتصال با سرور'
      );
    }
    return throwError('خطایی رخ داد .');
  }
}
