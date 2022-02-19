import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {EducationQualificationDbModel} from './education-qualification.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';
import {TeacherDbModel} from './teacher.db-model';

export class EducationCascadeDeletedByEnum {
  static TEACHER = 'teacher';
  static EDUCATION_QUALIFICATION = 'educationQualification';
}

export interface EducationInterface {
  id: number;
  teacherId: number;
  educationQualificationId: number;
  institution: string;
  specialty: string;
  yearOfIssue: number;
  description?: string;
  isDeleted: boolean;
  cascadeDeletedBy: string;
  guid: string;
}

@Table({tableName: 'Education', timestamps: false})
export class EducationDbModel extends Model<EducationInterface, CreateDbModelType<EducationInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  institution: string;

  @Column({allowNull: false, field: 'speciality'})
  specialty: string;

  @Column({allowNull: false})
  yearOfIssue: number;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => TeacherDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  teacherId: number;

  @BelongsTo(() => TeacherDbModel)
  teacher: TeacherDbModel;

  @ForeignKey(() => EducationQualificationDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  educationQualificationId: number;

  @BelongsTo(() => EducationQualificationDbModel)
  educationQualification: EducationQualificationDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({allowNull: true, type: DataType.STRING})
  cascadeDeletedBy?: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
