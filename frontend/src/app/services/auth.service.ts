import { computed, Injectable, Service, signal } from '@angular/core';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'hdnet_access_token';
const USER_KEY = 'hdnet_user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  private readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token());

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        sessionStorage.setItem(TOKEN_KEY, response.accessToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));

        this.token.set(response.accessToken);
        this.currentUser.set(response.user);
      }),
    );
  }

  getAccessToken(): string | null {
    return this.token();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    this.token.set(null);
    this.currentUser.set(null);
  }

  private readStoredUser(): AuthUser | null {
    const storedUser = sessionStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  }
}
