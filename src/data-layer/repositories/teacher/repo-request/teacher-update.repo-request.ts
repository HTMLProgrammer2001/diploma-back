export class TeacherUpdateRepoRequest {
  id: number;
  fullName: string;
  email: string;
  birthday?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  departmentId: number;
  commissionId: number;
  teacherRankId?: number;
  academicDegreeId?: number;
  academicTitleId?: number;
  workStartDate?: string;
}
