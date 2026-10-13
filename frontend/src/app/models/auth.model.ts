export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
  displayName: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}
