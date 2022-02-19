import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {DepartmentDbModel} from './department.db-model';
import {CommissionDbModel} from './commission.db-model';
import {TeachingRankDbModel} from './teaching-rank.db-model';
import {AcademicDegreeDbModel} from './academic-degree.db-model';
import {AcademicTitleDbModel} from './academic-title.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';
import {PublicationDbModel} from './publication.db-model';

export class TeacherCascadeDeletedByEnum {
  static ACADEMIC_DEGREE = 'academicDegree';
  static ACADEMIC_TITLE = 'academicTitle';
  static COMMISSION = 'commission';
  static DEPARTMENT = 'department';
  static TEACHING_RANK = 'teachingRank';
}

export interface TeacherInterface {
  id: number;
  fullName: string;
  email?: string;
  birthday?: Date;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  departmentId: number;
  commissionId: number;
  teacherRankId?: number;
  academicDegreeId?: number;
  academicTitleId?: number;
  workStartDate?: Date;
  isDeleted: boolean;
  cascadeDeletedBy: string;
  guid: string;
}

@Table({tableName: 'Teacher', timestamps: false})
export class TeacherDbModel extends Model<TeacherInterface, CreateDbModelType<TeacherInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  fullName: string;

  @Column({allowNull: false})
  email: string;

  @Column({allowNull: true, type: DataType.DATEONLY})
  birthday?: Date;

  @Column({allowNull: true})
  phone?: string;

  @Column({allowNull: true, type: DataType.STRING})
  address?: string;

  @Column({allowNull: true})
  avatarUrl?: string;

  @ForeignKey(() => DepartmentDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  departmentId: number;

  @BelongsTo(() => DepartmentDbModel)
  department: DepartmentDbModel;

  @ForeignKey(() => CommissionDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  commissionId: number;

  @BelongsTo(() => CommissionDbModel)
  commission: CommissionDbModel;

  @ForeignKey(() => TeachingRankDbModel)
  @Column({allowNull: true, type: DataType.INTEGER})
  teacherRankId?: number;

  @BelongsTo(() => TeachingRankDbModel)
  teacherRank?: TeachingRankDbModel;

  @ForeignKey(() => AcademicDegreeDbModel)
  @Column({allowNull: true, type: DataType.INTEGER})
  academicDegreeId?: number;

  @BelongsTo(() => AcademicDegreeDbModel)
  academicDegree?: AcademicDegreeDbModel;

  @ForeignKey(() => AcademicTitleDbModel)
  @Column({allowNull: true, type: DataType.INTEGER})
  academicTitleId?: number;

  @BelongsTo(() => AcademicTitleDbModel)
  academicTitle?: AcademicTitleDbModel;

  @BelongsToMany(() => PublicationDbModel, 'PublicationTeacher', 'teacherId', 'publicationId')
  publications: Array<PublicationDbModel>;

  @Column({allowNull: true, type: DataType.DATEONLY})
  workStartDate?: Date;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({allowNull: true, type: DataType.STRING})
  cascadeDeletedBy?: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
