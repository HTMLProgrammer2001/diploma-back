export class UserUpdateRepoRequest {
  id: number;
  fullName?: string;
  email?: string;
  passwordHash?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: number;
}
