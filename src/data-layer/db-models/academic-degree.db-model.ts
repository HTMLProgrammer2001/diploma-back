import {AutoIncrement, Column, HasMany, Model, Table} from 'sequelize-typescript';
import {TeacherDbModel} from './teacher.db-model';


@Table({tableName: 'AcademicDegree', timestamps: false})
export class AcademicDegreeDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @HasMany(() => TeacherDbModel)
  teachers: Array<TeacherDbModel>;
}
