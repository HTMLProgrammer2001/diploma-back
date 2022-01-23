import {AutoIncrement, Column, Model, Table} from 'sequelize-typescript';

@Table({tableName: 'Roles', timestamps: false})
export class RoleDbModel extends Model {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;
}
