import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {CategoryDbModel} from './category.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';
import {TeacherDbModel} from './teacher.db-model';

export class AttestationCascadeDeleteByEnum {
  static TEACHER = 'teacher';
  static CATEGORY = 'category';
}

export interface AttestationInterface {
  id: number;
  categoryId: number;
  teacherId: number;
  date: Date;
  description?: string;
  isDeleted: boolean;
  cascadeDeletedBy: string;
  guid: string;
}

@Table({tableName: 'Attestation', timestamps: false})
export class AttestationDbModel extends Model<AttestationInterface, CreateDbModelType<AttestationInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false, type: DataType.DATEONLY})
  date?: Date;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => TeacherDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  teacherId: number;

  @BelongsTo(() => TeacherDbModel)
  teacher: TeacherDbModel;

  @ForeignKey(() => CategoryDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  categoryId: number;

  @BelongsTo(() => CategoryDbModel)
  category: CategoryDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({allowNull: true, type: DataType.STRING})
  cascadeDeletedBy?: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
