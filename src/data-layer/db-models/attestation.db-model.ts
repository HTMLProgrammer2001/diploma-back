import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';
import {CategoryDbModel} from './category.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface AttestationInterface {
  id: number;
  categoryId: number;
  userId: number;
  date: Date;
  description?: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'Attestation', timestamps: false})
export class AttestationDbModel extends Model<AttestationInterface, CreateDbModelType<AttestationInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false, type: DataType.DATEONLY})
  date?: Date;

  @Column({allowNull: true})
  description?: string;

  @ForeignKey(() => UserDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => UserDbModel)
  user: UserDbModel;

  @ForeignKey(() => CategoryDbModel)
  @Column({allowNull: false, type: DataType.INTEGER})
  categoryId: number;

  @BelongsTo(() => CategoryDbModel)
  category: CategoryDbModel;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
