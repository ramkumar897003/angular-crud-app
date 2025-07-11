import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  error = signal('');
  isSubmitting = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onSubmit() {
    if (this.isSubmitting()) return;

    this.error.set('');
    this.isSubmitting.set(true);

    this.authService
      .login({ email: this.email(), password: this.password() })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken);
          this.authService.me().subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.error.set(error.message || 'Failed to get user data');
              this.isSubmitting.set(false);
            },
          });
        },
        error: (error) => {
          this.error.set(error.message || 'An error occurred during login');
          this.isSubmitting.set(false);
        },
      });
  }
}
