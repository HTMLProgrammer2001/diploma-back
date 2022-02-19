import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';
import {TeacherDbModel} from './teacher.db-model';

export class RebukeCascadeDeletedByEnum {
  static TEACHER = 'teacher';
}

export interface RebukeInterface {
  id: number;
  teacherId: number;
  title: string;
  date: Date;
  orderNumber?: string;
  description?: string;
  isActive?: boolean;
  isDeleted: boolean;
  cascadeDeletedBy: string;
  guid: string;
}

@Table({tableName: 'Rebuke', timestamps: false})
export class RebukeDbModel extends Model<RebukeInterface, CreateDbModelType<RebukeInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  title: string;

  @Column({allowNull: false, type: DataType.DATEONLY})
  date?: Date;

  @Column({allowNull: true})
  orderNumber?: string;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => TeacherDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  teacherId: number;

  @BelongsTo(() => TeacherDbModel)
  teacher: TeacherDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isActive?: boolean;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({allowNull: true, type: DataType.STRING})
  cascadeDeletedBy?: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
