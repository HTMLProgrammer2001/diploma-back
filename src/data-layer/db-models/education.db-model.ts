import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';
import {EducationQualificationDbModel} from './education-qualification.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface EducationInterface {
  id: number;
  userId: number;
  educationQualificationId: number;
  institution: string;
  specialty: string;
  yearOfIssue: number;
  description?: string;
  isDeleted: boolean;
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

  @ForeignKey(() => UserDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => UserDbModel)
  user: UserDbModel;

  @ForeignKey(() => EducationQualificationDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  educationQualificationId: number;

  @BelongsTo(() => EducationQualificationDbModel)
  educationQualification: EducationQualificationDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
