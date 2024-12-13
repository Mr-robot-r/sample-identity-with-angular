import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  unsubscribe: Subject<void> = new Subject();
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  registerForm: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toaster: ToastService,
  ) {
    this.registerForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}
  // tslint:disable-next-line: typedef
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.toaster.makeToast('toast-warning', 'Send Data', 'Sending Data');
    this.auth.
      login(this.registerForm.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async (res:any) => {
        if (res) {
          this.toaster.makeToast(
            'toast-success',
            'Login',
            'Login Successfully '
          );
          this.router.navigateByUrl('/');
        }
      });
  }
}
