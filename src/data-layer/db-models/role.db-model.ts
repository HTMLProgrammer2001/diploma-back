import {AutoIncrement, Column, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';

@Table({tableName: 'Roles', timestamps: false})
export class RoleDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;
}
