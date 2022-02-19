import {AutoIncrement, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {AttestationDbModel} from './attestation.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface CategoryInterface {
  id: number;
  name: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'Category', timestamps: false})
export class CategoryDbModel extends Model<CategoryInterface, CreateDbModelType<CategoryInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;

  @HasMany(() => AttestationDbModel)
  attestations: Array<AttestationDbModel>;
}
