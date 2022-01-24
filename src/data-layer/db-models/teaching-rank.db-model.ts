import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {TeacherDbModel} from './teacher.db-model';

@Table({tableName: 'TeachingRank', timestamps: false})
export class TeachingRankDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @HasMany(() => TeacherDbModel)
  teachers: Array<TeacherDbModel>;
}
