export class HonorUpdateRepoRequest {
  id: number;
  title: string;
  date?: Date;
  orderNumber?: string;
  description?: string;
  teacherId: number;
  isActive?: boolean;
}
