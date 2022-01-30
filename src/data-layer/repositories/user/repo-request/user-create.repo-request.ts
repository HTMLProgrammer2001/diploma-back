export class UserCreateRepoRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatarUrl?: string;
  roleId: number;
}
