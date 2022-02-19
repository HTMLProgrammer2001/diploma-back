export class HonorCreateRepoRequest {
  title: string;
  date?: Date;
  orderNumber?: string;
  description?: string;
  teacherId: number;
  isActive?: boolean;
}
