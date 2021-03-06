import {AutoIncrement, Column, Model, Table} from 'sequelize-typescript';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface ImportTypeInterface {
  id: number;
  name: string;
}

@Table({tableName: 'ImportType', timestamps: false})
export class ImportTypeDbModel extends Model<ImportTypeInterface, CreateDbModelType<ImportTypeInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;
}
