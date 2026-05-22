import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get emailCtrl() { return this.form.get('email')!; }
  get passwordCtrl() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/tracker']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Identifiants invalides.');
      }
    });
  }
}
