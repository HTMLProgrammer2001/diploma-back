import {RolesEnum} from '../constants/roles.enum';

export const readRoles = [RolesEnum.VIEWER, RolesEnum.MODERATOR, RolesEnum.ADMIN];
export const writeRoles = [RolesEnum.MODERATOR, RolesEnum.ADMIN];
export const userEditRoles = [RolesEnum.ADMIN];
export const notificationConfigurationRoles = [RolesEnum.ADMIN];
