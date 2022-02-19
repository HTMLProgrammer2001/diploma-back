export class EducationUpdateRepoRequest {
  id: number;
  institution: string;
  specialty: string;
  yearOfIssue: number;
  description?: string;
  teacherId: number;
  educationQualificationId: number;
}
