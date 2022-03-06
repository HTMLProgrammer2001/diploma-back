import {Injectable, Logger} from '@nestjs/common';
import {Workbook} from 'exceljs';
import {validate} from 'class-validator';
import {isNil, uniq} from 'lodash';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {ImportRequest} from '../types/request/import.request';
import {ImportErrorResponse, ImportResponse} from '../types/response/import.response';
import {ImportDataTypeEnum} from '../types/common/import-data-type.enum';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {UserImportColumnsEnum} from '../types/common/columns/user-import-columns.enum';
import {UserImportData} from '../types/common/import-data/user-import-data';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {ImportMapper} from '../mapper/import.mapper';
import {UserDbModel} from '../../../data-layer/db-models/user.db-model';
import {RoleDbModel} from '../../../data-layer/db-models/role.db-model';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';

@Injectable()
export class ImportService {
  static START_ROW = 2;
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private importMapper: ImportMapper,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository,
  ) {
    this.logger = new Logger(ImportService.name);
  }

  async importData(request: ImportRequest): Promise<ImportResponse> {
    try {
      switch (request.type) {
        case ImportDataTypeEnum.USER:
          return this.importUsers(request);

        default:
          throw new CustomError({code: ErrorCodesEnum.GENERAL, message: 'Unsupported type'});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async importUsers(request: ImportRequest): Promise<ImportResponse> {
    try {
      const workbook = new Workbook();
      const file = await request.file;
      const template = await workbook.xlsx.read(file.createReadStream());
      const worksheet = template.getWorksheet(1);

      const importErrors: Array<ImportErrorResponse> = [];
      let userImportDataArray: Array<UserImportData> = [];
      let startRow = request.from ?? ImportService.START_ROW;
      let currentRow = startRow;

      while (true) {
        const row = worksheet.getRow(currentRow);

        //read data from row
        const userImportData = new UserImportData();
        userImportData.fullName = String(row.getCell(UserImportColumnsEnum.FULL_NAME).value ?? '');
        userImportData.roleId = Number(row.getCell(UserImportColumnsEnum.ROLE).toString().split(' - ')[0]);
        userImportData.email = String(row.getCell(UserImportColumnsEnum.EMAIL).value ?? '');
        userImportData.phone = String(row.getCell(UserImportColumnsEnum.PHONE).value ?? '');
        userImportData.password = String(row.getCell(UserImportColumnsEnum.PASSWORD).value ?? '');
        userImportData.passwordHash = bcrypt.hashSync(userImportData.password, Number(this.configService.get('SALT')));

        //calculate is filled row
        const isFilledRow = userImportData.fullName || userImportData.roleId || userImportData.email
          || userImportData.phone || userImportData.password;

        if((isNil(request.to) && !isFilledRow) || (!isNil(request.to) && currentRow <= request.to)) {
          break;
        }
        else {
          //data validation of row
          const validationErrors = await validate(userImportData);
          validationErrors.forEach(validationError => {
            Object.values(validationError.constraints).map(errorMessage => {
              importErrors.push({row: currentRow, property: validationError.property, message: errorMessage});
            });
          });

          //add row to import if valid
          if(!validationErrors.length) {
            userImportDataArray.push(userImportData);
          }

          currentRow++;
        }
      }

      if(!userImportDataArray.length && !importErrors.length) {
        importErrors.push({message: 'No data to import'});
      }

      //logic validation
      const uniqueEmails: Array<string> = [];
      const uniquePhones: Array<string> = [];
      const existRoles: Array<number> = [];

      userImportDataArray = userImportDataArray.filter((userImportData, index) => {
        if(uniqueEmails.includes(userImportData.email)) {
          importErrors.push({row: startRow + index, property: 'email', message: 'Email not unique in file'});
          return false;
        }
        else {
          uniqueEmails.push(userImportData.email);
        }

        if(userImportData.phone && uniquePhones.includes(userImportData.phone)) {
          importErrors.push({row: startRow + index, property: 'phone', message: 'Phone not unique in file'});
          return false;
        }
        else if (userImportData.phone) {
          uniquePhones.push(userImportData.phone);
        }

        existRoles.push(userImportData.roleId);
        return true;
      });

      //local file validation without database end
      if(!request.ignoreErrors && importErrors.length) {
        return {result: false, errors: importErrors};
      }

      //get data to validate unique
      let usersWithEmails: Array<UserDbModel> = [];
      let usersWithPhones: Array<UserDbModel> = [];
      let roles: Array<RoleDbModel> = [];

      if(existRoles.length) {
        const getRoleRequest = this.importMapper.initializeGetRolesByIds(uniq(existRoles));
        const roleResponse = await this.roleRepository.getRoles(getRoleRequest);
        roles = roleResponse.data.responseList;
      }

      if(uniqueEmails.length) {
        const getUsersByEmailsRequest = this.importMapper.initializeGetUsersByEmails(uniqueEmails);
        const usersWithEmailsResponse = await this.userRepository.getUsers(getUsersByEmailsRequest);
        usersWithEmails = usersWithEmailsResponse.data.responseList;
      }

      if(uniquePhones.length) {
        const getUsersByPhonesRequest = this.importMapper.initializeGetUsersByPhones(uniquePhones);
        const usersWithPhonesResponse = await this.userRepository.getUsers(getUsersByPhonesRequest);
        usersWithPhones = usersWithPhonesResponse.data.responseList;
      }

      userImportDataArray = userImportDataArray.filter((userImportData, index) => {
        if(usersWithEmails.find(user => user.email === userImportData.email)) {
          importErrors.push({
            row: startRow + index,
            property: 'email',
            message: `User with email ${userImportData.email} already exist`
          });

          return false;
        }

        if(userImportData.phone && usersWithPhones.find(user => user.phone === userImportData.phone)) {
          importErrors.push({
            row: startRow + index,
            property: 'phone',
            message: `User with phone ${userImportData.phone} already exist`
          });

          return false;
        }

        if(!roles.find(role => role.id === userImportData.roleId)) {
          importErrors.push({
            row: startRow + index,
            property: 'role',
            message: `Role with id ${userImportData.roleId} not exist`
          });

          return false;
        }

        return true;
      });

      await this.userRepository.import(userImportDataArray, request.ignoreErrors);
      return {result: request.ignoreErrors ? true : !importErrors.length, errors: importErrors};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
