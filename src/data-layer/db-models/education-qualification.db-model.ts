import {AutoIncrement, Column, DataType, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';


@Table({tableName: 'EducationQualification', timestamps: false})
export class EducationQualificationDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;
}
