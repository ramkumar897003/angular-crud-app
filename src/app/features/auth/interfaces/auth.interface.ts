export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    roleId: number;
  };
}

export interface AuthError {
  message: string;
  status: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roleId: number;
}

export interface UserPermissions {
  id: number;
  email: string;
  name: string;
  permissions: string[];
}
