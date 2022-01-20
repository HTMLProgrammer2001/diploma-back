import {Global, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {CommissionDbModel} from './db-models/commission.db-model';
import {CommissionRepository} from './repositories/commission/commission.repository';

const sequelizeModels = () => SequelizeModule.forFeature([CommissionDbModel]);

@Global()
@Module({
  imports: [sequelizeModels()],
  providers: [CommissionRepository],
  exports: [sequelizeModels(), CommissionRepository]
})
export class DataModule {

}
