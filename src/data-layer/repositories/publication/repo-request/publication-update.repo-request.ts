export class PublicationUpdateRepoRequest {
  id: number;
  title: string;
  date: Date;
  publisher?: string;
  url?: string;
  anotherAuthors?: string;
  description?: string;
  teacherIds: Array<number>;
}
