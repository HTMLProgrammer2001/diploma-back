import {Global, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {CommissionDbModel} from './db-models/commission.db-model';
import {CommissionRepository} from './repositories/commission/commission.repository';
import {DepartmentRepository} from './repositories/department/department.repository';
import {DepartmentDbModel} from './db-models/department.db-model';
import {RoleDbModel} from './db-models/role.db-model';
import {RoleRepository} from './repositories/role/role.repository';
import {TeachingRankDbModel} from './db-models/teaching-rank.db-model';
import {TeachingRankRepository} from './repositories/teaching-rank/teaching-rank.repository';
import {TeacherDbModel} from './db-models/teacher.db-model';
import {TeacherRepository} from './repositories/teacher/teacher.repository';
import {AcademicDegreeDbModel} from './db-models/academic-degree.db-model';
import {AcademicDegreeRepository} from './repositories/academic-degree/academic-degree.repository';
import {AcademicTitleDbModel} from './db-models/academic-title.db-model';
import {AcademicTitleRepository} from './repositories/academic-title/academic-title.repository';
import {UserDbModel} from './db-models/user.db-model';
import {UserRepository} from './repositories/user/user.repository';
import {RefreshTokenDbModel} from './db-models/refresh-token-db.model';
import {RefreshTokenRepository} from './repositories/refresh-token/refresh-token.repository';
import {HonorDbModel} from './db-models/honor.db-model';
import {HonorRepository} from './repositories/honor/honor.repository';
import {RebukeDbModel} from './db-models/rebuke.db-model';
import {RebukeRepository} from './repositories/rebuke/rebuke.repository';
import {PublicationDbModel} from './db-models/publication.db-model';
import {PublicationRepository} from './repositories/publication/publication.repository';
import {InternshipDbModel} from './db-models/internship.db-model';
import {InternshipRepository} from './repositories/internship/internship.repository';
import {EducationQualificationDbModel} from './db-models/education-qualification.db-model';
import {EducationQualificationRepository} from './repositories/education-qualification/education-qualification.repository';
import {EducationDbModel} from './db-models/education.db-model';
import {EducationRepository} from './repositories/education/education.repository';
import {CategoryDbModel} from './db-models/category.db-model';
import {CategoryRepository} from './repositories/category/category.repository';

const getAppModels = () => SequelizeModule.forFeature([
  CommissionDbModel,
  DepartmentDbModel,
  RoleDbModel,
  TeachingRankDbModel,
  AcademicDegreeDbModel,
  AcademicTitleDbModel,
  TeacherDbModel,
  UserDbModel,
  RefreshTokenDbModel,
  HonorDbModel,
  RebukeDbModel,
  PublicationDbModel,
  InternshipDbModel,
  EducationQualificationDbModel,
  EducationDbModel,
  CategoryDbModel,
]);

const getAppRepositories = () => [
  CommissionRepository,
  DepartmentRepository,
  RoleRepository,
  TeachingRankRepository,
  AcademicDegreeRepository,
  AcademicTitleRepository,
  TeacherRepository,
  UserRepository,
  RefreshTokenRepository,
  HonorRepository,
  RebukeRepository,
  PublicationRepository,
  InternshipRepository,
  EducationQualificationRepository,
  EducationRepository,
  CategoryRepository,
]

@Global()
@Module({
  imports: [getAppModels()],
  providers: [...getAppRepositories()],
  exports: [getAppModels(), ...getAppRepositories()]
})
export class DataLayerModule {
}
