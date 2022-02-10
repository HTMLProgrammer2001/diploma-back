import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import sequelize, {Op, WhereOptions} from 'sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model, Sequelize} from 'sequelize-typescript';
import {UserDbModel} from '../../db-models/user.db-model';
import {PublicationDbModel} from '../../db-models/publication.db-model';
import {PublicationGetRepoRequest} from './repo-request/publication-get.repo-request';
import {PublicationGetRepoResponse} from './repo-response/publication-get.repo-response';
import {PublicationSelectFieldsEnum} from './enums/publication-select-fields.enum';
import {PublicationOrderFieldsEnum} from './enums/publication-order-fields.enum';
import {PublicationCreateRepoRequest} from './repo-request/publication-create.repo-request';
import {PublicationUpdateRepoRequest} from './repo-request/publication-update.repo-request';
import {PublicationDeleteRepoRequest} from './repo-request/publication-delete.repo-request';

@Injectable()
export class PublicationRepository {
  private logger: Logger;

  constructor(@InjectModel(PublicationDbModel) private publicationDbModel: typeof PublicationDbModel) {
    this.logger = new Logger(PublicationRepository.name);
  }

  async getPublications(repoRequest: PublicationGetRepoRequest): Promise<PublicationGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [PublicationSelectFieldsEnum.ID, PublicationSelectFieldsEnum.TITLE];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case PublicationSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case PublicationSelectFieldsEnum.TITLE:
            attributes.push('title');
            break;

          case PublicationSelectFieldsEnum.DATE:
            attributes.push('date');
            break;

          case PublicationSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case PublicationSelectFieldsEnum.PUBLISHER:
            attributes.push('publisher');
            break;

          case PublicationSelectFieldsEnum.ANOTHER_AUTHORS:
            attributes.push('anotherAuthors');
            break;

          case PublicationSelectFieldsEnum.URL:
            attributes.push('url');
            break;

          case PublicationSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case PublicationSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case PublicationSelectFieldsEnum.USER_ID:
            if (!includes.user)
              includes.user = {model: UserDbModel, attributes: ['id']}
            else
              (includes.user.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case PublicationSelectFieldsEnum.USER_NAME:
            if (!includes.user)
              includes.user = {model: UserDbModel, attributes: ['fullName']}
            else
              (includes.user.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions = {};

      if (!isNil(repoRequest.title)) {
        filters.title = {[Op.like]: `%${repoRequest.title || ''}%`};
      }

      if (!isNil(repoRequest.publisher)) {
        filters.publisher = {[Op.like]: `%${repoRequest.publisher || ''}%`};
      }

      if (!isNil(repoRequest.dateMore)) {
        filters.date = {[Op.gte]: repoRequest.dateMore};
      }

      if (!isNil(repoRequest.dateLess)) {
        filters.date = {[Op.lte]: repoRequest.dateLess};
      }

      if (!isNil(repoRequest.userIds)) {
        filters[<any>Op.and] = Sequelize.literal(`(
          SELECT COUNT(PublicationUser.userId) FROM PublicationUser WHERE 
          PublicationUser.publicationId = PublicationDbModel.id AND PublicationUser.userId IN (${repoRequest.userIds.join(',')})
        ) = ${repoRequest.userIds.length}`);
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      //endregion

      //region Sorting

      const order = [];

      if (!isNil(repoRequest.orderField)) {
        switch (repoRequest.orderField) {
          case PublicationOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case PublicationOrderFieldsEnum.TITLE:
            order.push(['title', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case PublicationOrderFieldsEnum.DATE:
            order.push(['date', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.publicationDbModel.findAndCountAll({
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

  async createPublication(repoRequest: PublicationCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.publicationDbModel.create({
        title: repoRequest.title,
        date: repoRequest.date,
        description: repoRequest.description,
        publisher: repoRequest.publisher,
        url: repoRequest.url,
        anotherAuthors: repoRequest.anotherAuthors,
      }).then(async publication => {
        await publication.$set('users', repoRequest.userIds);
        return publication;
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

  async updatePublication(repoRequest: PublicationUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as Omit<PublicationDbModel, keyof Model>;

    if (!isUndefined(repoRequest.title)) {
      updateData.title = repoRequest.title;
    }

    if (!isUndefined(repoRequest.url)) {
      updateData.url = repoRequest.url;
    }

    if (!isUndefined(repoRequest.anotherAuthors)) {
      updateData.anotherAuthors = repoRequest.anotherAuthors;
    }

    if (!isUndefined(repoRequest.publisher)) {
      updateData.publisher = repoRequest.publisher;
    }

    if (!isUndefined(repoRequest.date)) {
      updateData.date = repoRequest.date;
    }

    if (!isUndefined(repoRequest.description)) {
      updateData.description = repoRequest.description;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.publicationDbModel.update(updateData, {where: {id: repoRequest.id}}).then((async _ => {
        if (!isNil(repoRequest.userIds)) {
          const publication = await this.publicationDbModel.findByPk(repoRequest.id);
          await publication.$set('users', repoRequest.userIds);
        }
      }));
    }

    return {updatedID: repoRequest.id};
  }

  async deletePublication(repoRequest: PublicationDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.publicationDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
      return {deletedID: repoRequest.id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }
}
