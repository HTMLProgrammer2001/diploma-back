import {BelongsTo, Column, DataType, ForeignKey, Model, Table,} from 'sequelize-typescript';
import {UserDbModel} from './user.db-model';
import Sequelize from 'sequelize';

export interface TokenInterface {
  userId: number;
  sessionCode: string;
  creationTime?: string;
  expirationTime: string;
}

@Table({tableName: 'RefreshToken', timestamps: false})
export class RefreshTokenDbModel extends Model<TokenInterface, TokenInterface> {
  @Column({allowNull: false, primaryKey: true})
  sessionCode: string;

  @ForeignKey(() => UserDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => UserDbModel)
  user: UserDbModel;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: Sequelize.NOW
  })
  creationTime: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  expirationTime: Date;
}
