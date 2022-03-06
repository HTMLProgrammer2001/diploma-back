import {AutoIncrement, Column, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface ImportTypeInterface {
  id: number;
  name: string;
  guid: string;
}

@Table({tableName: 'ImportType', timestamps: false})
export class ImportTypeDbModel extends Model<ImportTypeInterface, CreateDbModelType<ImportTypeInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;
}
