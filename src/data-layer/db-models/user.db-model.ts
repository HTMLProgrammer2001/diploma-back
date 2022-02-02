import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {RoleDbModel} from './role.db-model';
import {TokenDbModel} from './token.db-model';

export interface UserInterface {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatarUrl?: string;
  roleId: number;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'User', timestamps: false})
export class UserDbModel extends Model<UserInterface, Omit<UserInterface, 'guid' | 'id' | 'isDeleted'>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  fullName: string;

  @Column({allowNull: false})
  email: string;

  @Column({allowNull: false})
  passwordHash: string;

  @Column({allowNull: true})
  phone?: string;

  @Column({allowNull: true})
  avatarUrl?: string;

  @ForeignKey(() => RoleDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  roleId: number;

  @BelongsTo(() => RoleDbModel)
  role: RoleDbModel;

  @HasOne(() => TokenDbModel)
  token: TokenDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
