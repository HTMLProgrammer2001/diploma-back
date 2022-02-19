import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {RoleDbModel} from './role.db-model';
import {RefreshTokenDbModel} from './refresh-token-db.model';
import {PublicationDbModel} from './publication.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

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
export class UserDbModel extends Model<UserInterface, CreateDbModelType<UserInterface>> {
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

  @HasOne(() => RefreshTokenDbModel)
  token: RefreshTokenDbModel;

  @BelongsToMany(() => PublicationDbModel, 'PublicationUser', 'userId', 'publicationId')
  publications: Array<PublicationDbModel>;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
