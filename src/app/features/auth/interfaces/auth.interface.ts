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

interface BaseUser {
  id: number;
  email: string;
  name: string;
  roleId: number;
}
export interface User extends BaseUser {
  password: string;
}

export interface UserPermissions extends BaseUser {
  permissions: string[];
}
