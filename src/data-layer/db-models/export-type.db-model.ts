import {AutoIncrement, Column, Model, Table} from 'sequelize-typescript';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface ExportTypeInterface {
  id: number;
  name: string;
}

@Table({tableName: 'ExportType', timestamps: false})
export class ExportTypeDbModel extends Model<ExportTypeInterface, CreateDbModelType<ExportTypeInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;
}
