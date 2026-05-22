import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../models/user.model';

const TOKEN_KEY = 'sw_token';
const USER_KEY = 'sw_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _user = signal<User | null>(this.loadUser());

  readonly currentUser = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this._token();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthResponse(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.access_token);
    this._token.set(res.access_token);

    if (res.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      this._user.set(res.user);
    } else {
      // Decode user from JWT payload
      const user = this.decodeTokenUser(res.access_token);
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._user.set(user);
      }
    }
  }

  private decodeTokenUser(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.sub,
        email: decoded.email ?? '',
        username: decoded.username ?? decoded.email ?? ''
      };
    } catch {
      return null;
    }
  }
}
