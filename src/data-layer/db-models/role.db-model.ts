import {AutoIncrement, Column, HasMany, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface RoleInterface {
  id: number;
  name: string;
  guid: string;
}

@Table({tableName: 'Roles', timestamps: false})
export class RoleDbModel extends Model<RoleInterface, CreateDbModelType<RoleInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  name: string;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid: string;

  @HasMany(() => UserDbModel)
  users: Array<UserDbModel>;
}
