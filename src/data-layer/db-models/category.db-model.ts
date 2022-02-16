import {AutoIncrement, Column, DataType, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({tableName: 'Categories', timestamps: false})
export class CategoryDbModel extends Model {
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
