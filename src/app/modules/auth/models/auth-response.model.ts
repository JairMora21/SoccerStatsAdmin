// models/auth-response.model.ts
export interface AuthResponse {
    token: string | null;
    refreshToken: string | null;
    expiration: Date | null;
    resultado: boolean;
    msg: string;
  }
  