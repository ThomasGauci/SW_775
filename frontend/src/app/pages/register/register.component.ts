import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
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
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailCtrl() { return this.form.get('email')!; }
  get usernameCtrl() { return this.form.get('username')!; }
  get passwordCtrl() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/tracker']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Erreur lors de l\'inscription.');
      }
    });
  }
}
