// models/auth-response.model.ts
export interface AuthResponse {
    token: string | null;
    refreshToken: string | null;
    expiration: string | null;
    resultado: boolean;
    msg: string;
  }
  