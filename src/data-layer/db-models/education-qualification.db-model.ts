import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {EducationDbModel} from './education.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface EducationQualificationInterface {
  id: number;
  name: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'EducationQualification', timestamps: false})
export class EducationQualificationDbModel extends Model<EducationQualificationInterface, CreateDbModelType<EducationQualificationInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;

  @HasMany(() => EducationDbModel)
  educations: Array<EducationDbModel>;
}
