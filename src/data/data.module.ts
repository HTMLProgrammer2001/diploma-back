import {Global, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {CommissionDbModel} from './db-models/commission.db-model';
import {CommissionRepository} from './repositories/commission/commission.repository';
import {DepartmentRepository} from './repositories/department/department.repository';
import {DepartmentDbModel} from './db-models/department.db-model';

const sequelizeModels = () => SequelizeModule.forFeature([CommissionDbModel, DepartmentDbModel]);

@Global()
@Module({
  imports: [sequelizeModels()],
  providers: [CommissionRepository, DepartmentRepository],
  exports: [sequelizeModels(), CommissionRepository, DepartmentRepository]
})
export class DataModule {}
