export interface InternshipHoursDbModel {
  teacherId: number;
  hours: number;
}

export class InternshipGetHoursRepoResponse {
  data: Array<InternshipHoursDbModel>;
}
