import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {TeacherDbModel} from './teacher.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface DepartmentInterface {
  id: number;
  name: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'Departments', timestamps: false})
export class DepartmentDbModel extends Model<DepartmentInterface, CreateDbModelType<DepartmentInterface>> {
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
