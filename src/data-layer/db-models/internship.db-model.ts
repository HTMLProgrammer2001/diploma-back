import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';
import {TeacherDbModel} from './teacher.db-model';

export interface InternshipInterface {
  id: number;
  teacherId: number;
  title: string;
  code: string;
  from: Date;
  to: Date;
  place?: string;
  hours: number;
  credits?: number;
  description?: string;
  isDeleted: boolean;
  isCascadeDelete: boolean;
  guid: string;
}

@Table({tableName: 'Internship', timestamps: false})
export class InternshipDbModel extends Model<InternshipInterface, CreateDbModelType<InternshipInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  title: string;

  @Column({allowNull: false})
  code: string;

  @Column({allowNull: false, type: DataType.DATEONLY})
  from: Date;

  @Column({allowNull: false, type: DataType.DATEONLY})
  to: Date;

  @Column({allowNull: true})
  place?: string;

  @Column({allowNull: false})
  hours: number;

  @Column({allowNull: true})
  credits?: number;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => TeacherDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  teacherId: number;

  @BelongsTo(() => TeacherDbModel)
  teacher: TeacherDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isCascadeDelete?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
