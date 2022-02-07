import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';

export interface RebukeInterface {
  id: number;
  userId: number;
  title: string;
  date: Date;
  orderNumber?: string;
  description?: string;
  isActive?: boolean;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'Rebuke', timestamps: false})
export class RebukeDbModel extends Model<RebukeInterface, Omit<RebukeInterface, 'guid' | 'id' | 'isDeleted'>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  title: string;

  @Column({allowNull: false, type: DataType.DATEONLY})
  date?: Date;

  @Column({allowNull: true})
  orderNumber?: string;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => UserDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => UserDbModel)
  user: UserDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isActive?: boolean;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
