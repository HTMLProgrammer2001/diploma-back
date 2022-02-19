import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {TeacherDbModel} from './teacher.db-model';
import sequelize from 'sequelize';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface AcademicDegreeInterface {
  id: number;
  name: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'AcademicDegree', timestamps: false})
export class AcademicDegreeDbModel extends Model<AcademicDegreeInterface, CreateDbModelType<AcademicDegreeInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;

  @HasMany(() => TeacherDbModel)
  teachers: Array<TeacherDbModel>;
}
