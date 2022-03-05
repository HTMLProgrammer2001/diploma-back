import {Injectable} from '@nestjs/common';
import {RoleGetRepoRequest} from '../../../data-layer/repositories/role/repo-request/role-get.repo-request';
import {RoleSelectFieldsEnum} from '../../../data-layer/repositories/role/enums/role-select-fields.enum';

@Injectable()
export class ImportMapper {
  initializeGetAllRolesRepoRequest(): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.select = [RoleSelectFieldsEnum.ID, RoleSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }
}
