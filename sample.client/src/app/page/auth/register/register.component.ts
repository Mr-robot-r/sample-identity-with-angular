import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { RepositoryService } from '../../../service/repository.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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
      Email: ['', Validators.required,Validators.email],
      Password: ['', [Validators.required]],
      ConfirmPassword: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
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
      register(this.registerForm.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async (res:any) => {
        if (res) {
          this.toaster.makeToast(
            'toast-success',
            'register',
            'register Successfully Check your Email'
          );
          this.router.navigateByUrl('/auth/login');
        }
      });
  }
}
