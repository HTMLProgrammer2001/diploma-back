import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {TeacherDbModel} from './teacher.db-model';
import sequelize from 'sequelize';

@Table({tableName: 'TeachingRank', timestamps: false})
export class TeachingRankDbModel extends Model {
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
