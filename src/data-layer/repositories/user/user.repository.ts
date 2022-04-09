import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import sequelize, {Op, WhereOptions} from 'sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {UserDbModel, UserInterface} from '../../db-models/user.db-model';
import {RoleDbModel} from '../../db-models/role.db-model';
import {UserGetRepoRequest} from './repo-request/user-get.repo-request';
import {UserGetRepoResponse} from './repo-response/user-get.repo-response';
import {UserSelectFieldsEnum} from './enums/user-select-fields.enum';
import {UserOrderFieldsEnum} from './enums/user-order-fields.enum';
import {UserCreateRepoRequest} from './repo-request/user-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {UserUpdateRepoRequest} from './repo-request/user-update.repo-request';
import {UserDeleteRepoRequest} from './repo-request/user-delete.repo-request';
import {UserImportData} from '../../../features/import/types/common/import-data/user-import-data';

@Injectable()
export class UserRepository {
  private logger: Logger;

  constructor(@InjectModel(UserDbModel) private userDbModel: typeof UserDbModel) {
    this.logger = new Logger(UserRepository.name);
  }

  async getUsers(repoRequest: UserGetRepoRequest): Promise<UserGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.FULL_NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case UserSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case UserSelectFieldsEnum.FULL_NAME:
            attributes.push('fullName');
            break;

          case UserSelectFieldsEnum.EMAIL:
            attributes.push('email');
            break;

          case UserSelectFieldsEnum.PASSWORD_HASH:
            attributes.push('passwordHash');
            break;

          case UserSelectFieldsEnum.PHONE:
            attributes.push('phone');
            break;

          case UserSelectFieldsEnum.AVATAR_URL:
            attributes.push('avatarUrl');
            break;

          case UserSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case UserSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case UserSelectFieldsEnum.ROLE_ID:
            if (!includes.role)
              includes.role = {model: RoleDbModel, attributes: ['id']}
            else
              (includes.role.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case UserSelectFieldsEnum.ROLE_NAME:
            if (!includes.role)
              includes.role = {model: RoleDbModel, attributes: ['name']}
            else
              (includes.role.attributes as Array<string | ProjectionAlias>).push('name');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<UserInterface> = {};

      if (repoRequest.fullName) {
        filters.fullName = {[Op.like]: `%${repoRequest.fullName || ''}%`};
      }

      if (repoRequest.email) {
        filters.email = {[Op.like]: `%${repoRequest.email || ''}%`};
      }

      if (!isNil(repoRequest.roleId)) {
        filters.roleId = {[Op.eq]: repoRequest.roleId};
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!isNil(repoRequest.emailEqual)) {
        filters.email = repoRequest.emailEqual;
      }

      if (!isNil(repoRequest.phoneEqual)) {
        filters.phone = repoRequest.phoneEqual;
      }

      if (!isNil(repoRequest.emailIn)) {
        filters.email = {[Op.in]: repoRequest.emailIn};
      }

      if (!isNil(repoRequest.phoneIn)) {
        filters.phone = {[Op.in]: repoRequest.phoneIn};
      }

      //endregion

      //region Sorting

      const order = [];

      if (!isNil(repoRequest.orderField)) {
        switch (repoRequest.orderField) {
          case UserOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case UserOrderFieldsEnum.FULL_NAME:
            order.push(['fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case UserOrderFieldsEnum.EMAIL:
            order.push(['email', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case UserOrderFieldsEnum.ROLE_NAME:
            includes.role = includes.role ?? {model: RoleDbModel, attributes: []};
            order.push([{model: RoleDbModel, as: 'role'}, 'name', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.userDbModel.findAndCountAll({
        where: filters,
        order,
        attributes,
        offset: (repoRequest.page - 1) * repoRequest.size,
        limit: repoRequest.size,
        include: Object.values(includes)
      });

      return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async createUser(repoRequest: UserCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.userDbModel.create({
        fullName: repoRequest.fullName,
        email: repoRequest.email,
        avatarUrl: repoRequest.avatarUrl,
        phone: repoRequest.phone,
        roleId: repoRequest.roleId,
        passwordHash: repoRequest.passwordHash
      });
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateUser(repoRequest: UserUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as UserInterface;

    if (!isUndefined(repoRequest.email)) {
      updateData.email = repoRequest.email;
    }

    if (!isUndefined(repoRequest.fullName)) {
      updateData.fullName = repoRequest.fullName;
    }

    if (!isUndefined(repoRequest.avatarUrl)) {
      updateData.avatarUrl = repoRequest.avatarUrl;
    }

    if (!isUndefined(repoRequest.phone)) {
      updateData.phone = repoRequest.phone;
    }

    if (!isUndefined(repoRequest.passwordHash)) {
      updateData.passwordHash = repoRequest.passwordHash;
    }

    if (!isUndefined(repoRequest.roleId)) {
      updateData.roleId = repoRequest.roleId;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.userDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteUser(repoRequest: UserDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.userDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
      return {deletedID: repoRequest.id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async import(data: Array<UserImportData>, ignoreErrors: boolean): Promise<void> {
    try {
      await this.userDbModel.bulkCreate(data.map(el => ({
        fullName: el.fullName,
        email: el.email,
        roleId: el.roleId,
        passwordHash: el.passwordHash
      })), {ignoreDuplicates: ignoreErrors})
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }
}
