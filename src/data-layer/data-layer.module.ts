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

const getAppModels = () => SequelizeModule.forFeature([
  CommissionDbModel,
  DepartmentDbModel,
  RoleDbModel,
  TeachingRankDbModel,
]);

const getAppRepositories = () => [
  CommissionRepository,
  DepartmentRepository,
  RoleRepository,
  TeachingRankRepository,
]

@Global()
@Module({
  imports: [getAppModels()],
  providers: [...getAppRepositories()],
  exports: [getAppModels(), ...getAppRepositories()]
})
export class DataLayerModule {}
