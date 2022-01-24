import {AutoIncrement, Column, HasMany, Model, Table} from 'sequelize-typescript';
import {TeacherDbModel} from './teacher.db-model';


@Table({tableName: 'AcademicTitle', timestamps: false})
export class AcademicTitleDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @HasMany(() => TeacherDbModel)
  teachers: Array<TeacherDbModel>;
}
