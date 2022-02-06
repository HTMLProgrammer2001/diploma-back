import {RolesEnum} from '../../constants/roles.enum';

export interface IAccessTokenInfoInterface {
  userId: number;
  role: RolesEnum;
}
