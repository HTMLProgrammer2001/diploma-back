import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {TeacherDbModel} from './teacher.db-model';
import sequelize from 'sequelize';


@Table({tableName: 'AcademicTitle', timestamps: false})
export class AcademicTitleDbModel extends Model {
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
