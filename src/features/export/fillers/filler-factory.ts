import {Injectable} from '@nestjs/common';
import {FillerInterface} from './filler.interface';
import {TeacherFiller} from './teacher-filler';
import {MockFiller} from './mock-filler';

@Injectable()
export class FillerFactory {
  getTeacherInfoFiller(isIncludePersonal: boolean, isIncludeProfessional: boolean): FillerInterface {
    return new TeacherFiller(isIncludePersonal, isIncludeProfessional);
  }

  getInternshipFiller(): FillerInterface {
    return new MockFiller();
  }

  getAttestationFiller(): FillerInterface {
    return new MockFiller();
  }

  getRebukeFiller(): FillerInterface {
    return new MockFiller();
  }

  getHonorFiller(): FillerInterface {
    return new MockFiller();
  }

  getPublicationFiller(): FillerInterface {
    return new MockFiller();
  }
}
