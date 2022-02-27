import {Injectable} from '@nestjs/common';
import {FillerInterface} from './filler.interface';
import {TeacherFiller} from './teacher-filler';
import {InternshipFiller} from './internship-filler';
import {AttestationFiller} from './attestation-filler';
import {RebukeFiller} from './rebuke-filler';
import {HonorFiller} from './honor-filler';
import {PublicationFiller} from './publication-filler';

@Injectable()
export class FillerFactory {
  getTeacherInfoFiller(isIncludePersonal: boolean, isIncludeProfessional: boolean): FillerInterface {
    return new TeacherFiller(isIncludePersonal, isIncludeProfessional);
  }

  getInternshipFiller(): FillerInterface {
    return new InternshipFiller();
  }

  getAttestationFiller(): FillerInterface {
    return new AttestationFiller();
  }

  getRebukeFiller(): FillerInterface {
    return new RebukeFiller();
  }

  getHonorFiller(): FillerInterface {
    return new HonorFiller();
  }

  getPublicationFiller(): FillerInterface {
    return new PublicationFiller();
  }
}
