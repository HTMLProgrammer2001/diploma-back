import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {UserDbModel} from './user.db-model';

export interface TokenInterface {
  userId: number;
  token: string;
}

@Table({tableName: 'Token', timestamps: false})
export class TokenDbModel extends Model<TokenInterface, TokenInterface> {
  @Column({allowNull: false, unique: true})
  token: string;

  @ForeignKey(() => UserDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => UserDbModel)
  user: UserDbModel;
}
