import {AutoIncrement, BelongsToMany, Column, DataType, Model, Table} from 'sequelize-typescript';
import sequelize from 'sequelize';
import {UserDbModel} from './user.db-model';
import {CreateDbModelType} from '../repositories/common/create-db-model.type';

export interface PublicationInterface {
  id: number;
  title: string;
  date: Date;
  publisher?: string;
  url?: string;
  anotherAuthors?: string;
  description?: string;
  isDeleted: boolean;
  guid: string;
}

@Table({tableName: 'Publication', timestamps: false})
export class PublicationDbModel extends Model<PublicationInterface, CreateDbModelType<PublicationInterface>> {
  @AutoIncrement
  @Column({primaryKey: true})
  id: number;

  @Column({allowNull: false})
  title: string;

  @Column({allowNull: false, type: DataType.DATEONLY})
  date?: Date;

  @Column({allowNull: true})
  publisher?: string;

  @Column({allowNull: true})
  url?: string;

  @Column({allowNull: true})
  anotherAuthors?: string;

  @Column({allowNull: true})
  description?: string;

  @BelongsToMany(() => UserDbModel, 'PublicationUser', 'publicationId', 'userId')
  users: Array<UserDbModel>;

  @Column({defaultValue: false, type: DataType.BOOLEAN})
  isDeleted?: boolean;

  @Column({defaultValue: sequelize.literal('(UUID())'), unique: true})
  guid?: string;
}
