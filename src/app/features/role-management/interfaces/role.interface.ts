export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: number[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: number[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions: number[];
}

export interface RoleError {
  message: string;
  status: number;
}
