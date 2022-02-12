export class InternshipUpdateRepoRequest {
  id: number;
  title?: string;
  from?: Date;
  to?: Date;
  code?: string;
  place?: string;
  hours?: number;
  credits?: number;
  description?: string;
  userId?: number;
}
