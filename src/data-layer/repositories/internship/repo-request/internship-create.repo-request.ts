export class InternshipCreateRepoRequest {
  title: string;
  from: Date;
  to: Date;
  code: string;
  place?: string;
  hours: number;
  credits?: number;
  description?: string;
  teacherId: number;
}
