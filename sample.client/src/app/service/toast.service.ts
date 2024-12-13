import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  public makeToast(type: string, title: string, content: string) {
    return this.showToast(type, title, content);
  }
  private showToast(type: string, title: string, body: string) {
    this.toastr.show(
      body,
      title,
      {
        timeOut: 2000,
        easing: 'ease-in',
        progressBar: true,
        positionClass: 'toast-bottom-right',
      },
      type
    );
  }
}
