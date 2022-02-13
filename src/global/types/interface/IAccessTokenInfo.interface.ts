import {RolesEnum} from '../../constants/roles.enum';
import {AccessTokenTypeEnum} from '../../constants/access-token-type.enum';

export interface IAccessTokenInfoInterface {
  type: AccessTokenTypeEnum;
  userId: number;
  role: RolesEnum;
}
