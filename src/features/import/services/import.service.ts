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
import {InternshipImportData} from '../types/common/import-data/internship-import-data';
import {InternshipImportColumnsEnum} from '../types/common/columns/internship-import-columns.enum';
import {isFilledWithData} from '../../../global/utils/functions';
import {InternshipDbModel} from '../../../data-layer/db-models/internship.db-model';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {InternshipRepository} from '../../../data-layer/repositories/internship/internship.repository';
import {PublicationImportData} from '../types/common/import-data/publication-import-data';
import {PublicationImportColumnsEnum} from '../types/common/columns/publication-import-columns.enum';
import {PublicationRepository} from '../../../data-layer/repositories/publication/publication.repository';

@Injectable()
export class ImportService {
  static START_ROW = 2;
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private importMapper: ImportMapper,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository,
    private teacherRepository: TeacherRepository,
    private internshipRepository: InternshipRepository,
    private publicationRepository: PublicationRepository,
  ) {
    this.logger = new Logger(ImportService.name);
  }

  async importData(request: ImportRequest): Promise<ImportResponse> {
    try {
      switch (request.type) {
        case ImportDataTypeEnum.USER:
          return this.importUsers(request);

        case ImportDataTypeEnum.INTERNSHIP:
          return this.importInternships(request);

        case ImportDataTypeEnum.PUBLICATION:
          return this.importPublications(request);

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
        userImportData.email = String(row.getCell(UserImportColumnsEnum.EMAIL).value ?? '');
        userImportData.phone = String(row.getCell(UserImportColumnsEnum.PHONE).value ?? '');
        userImportData.password = String(row.getCell(UserImportColumnsEnum.PASSWORD).value ?? '');
        userImportData.passwordHash = bcrypt.hashSync(userImportData.password, Number(this.configService.get('SALT')));
        if(row.getCell(UserImportColumnsEnum.ROLE).value) {
          userImportData.roleId = Number(row.getCell(UserImportColumnsEnum.ROLE).value.toString().split(' - ')[0]);
        }

        if((isNil(request.to) && !isFilledWithData(row)) || (!isNil(request.to) && currentRow <= request.to)) {
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

  async importInternships(request: ImportRequest): Promise<ImportResponse> {
    try {
      const workbook = new Workbook();
      const file = await request.file;
      const template = await workbook.xlsx.read(file.createReadStream());
      const worksheet = template.getWorksheet(1);

      const importErrors: Array<ImportErrorResponse> = [];
      let internshipImportDataArray: Array<InternshipImportData> = [];
      let startRow = request.from ?? ImportService.START_ROW;
      let currentRow = startRow;

      while (true) {
        const row = worksheet.getRow(currentRow);

        //read data from row
        const internshipImportData = new InternshipImportData();

        if(row.getCell(InternshipImportColumnsEnum.TEACHER).value) {
          internshipImportData.teacherId = Number(row.getCell(InternshipImportColumnsEnum.TEACHER).value.toString().split(' - ')[0]);
        }

        internshipImportData.title = String(row.getCell(InternshipImportColumnsEnum.TITLE).value ?? '');
        internshipImportData.code = String(row.getCell(InternshipImportColumnsEnum.CODE).value ?? '');

        if(row.getCell(InternshipImportColumnsEnum.DESCRIPTION).value) {
          internshipImportData.description = String(row.getCell(InternshipImportColumnsEnum.DESCRIPTION).value ?? '');
        }

        if(row.getCell(InternshipImportColumnsEnum.PLACE).value) {
          internshipImportData.place = String(row.getCell(InternshipImportColumnsEnum.PLACE).value ?? '');
        }

        if(row.getCell(InternshipImportColumnsEnum.FROM).value){
          internshipImportData.from = new Date(String(row.getCell(InternshipImportColumnsEnum.FROM).value ?? ''));
        }

        if(row.getCell(InternshipImportColumnsEnum.TO).value){
          internshipImportData.to = new Date(String(row.getCell(InternshipImportColumnsEnum.TO).value ?? ''));
        }

        internshipImportData.isToMoreThanFrom = internshipImportData.from && internshipImportData.to
          && internshipImportData.to >= internshipImportData.from;


        if(row.getCell(InternshipImportColumnsEnum.HOURS).value) {
          internshipImportData.hours = Number(row.getCell(InternshipImportColumnsEnum.HOURS).value ?? 0);
        }

        if(row.getCell(InternshipImportColumnsEnum.CREDITS).value) {
          internshipImportData.credits = Number(row.getCell(InternshipImportColumnsEnum.CREDITS).value ?? 0);
        }

        if((isNil(request.to) && !isFilledWithData(row)) || (!isNil(request.to) && currentRow <= request.to)) {
          break;
        }
        else {
          //data validation of row
          const validationErrors = await validate(internshipImportData);
          validationErrors.forEach(validationError => {
            Object.values(validationError.constraints).map(errorMessage => {
              importErrors.push({row: currentRow, property: validationError.property, message: errorMessage});
            });
          });

          //add row to import if valid
          if(!validationErrors.length) {
            internshipImportDataArray.push(internshipImportData);
          }

          currentRow++;
        }
      }

      if(!internshipImportDataArray.length && !importErrors.length) {
        importErrors.push({message: 'No data to import'});
      }

      //logic validation
      const uniqueCodes: Array<string> = [];
      const existTeachers: Array<number> = [];

      internshipImportDataArray = internshipImportDataArray.filter((internshipImportData, index) => {
        if(uniqueCodes.includes(internshipImportData.code)) {
          importErrors.push({row: startRow + index, property: 'code', message: 'Code not unique in file'});
          return false;
        }
        else {
          uniqueCodes.push(internshipImportData.code);
        }

        existTeachers.push(internshipImportData.teacherId);
        return true;
      });

      //local file validation without database end
      if(!request.ignoreErrors && importErrors.length) {
        return {result: false, errors: importErrors};
      }

      //get data to validate unique
      let internshipsWithCodes: Array<InternshipDbModel> = [];
      let teachers: Array<TeacherDbModel> = [];

      if(existTeachers.length) {
        const getTeachersRequest = this.importMapper.initializeGetTeachersByIds(uniq(existTeachers));
        const teacherResponse = await this.teacherRepository.getTeachers(getTeachersRequest);
        teachers = teacherResponse.data.responseList;
      }

      if(uniqueCodes.length) {
        const getInternshipsByEmailsRequest = this.importMapper.initializeGetInternshipsByCodes(uniqueCodes);
        const internshipsWithCodesResponse = await this.internshipRepository.getInternships(getInternshipsByEmailsRequest);
        internshipsWithCodes = internshipsWithCodesResponse.data.responseList;
      }

      internshipImportDataArray = internshipImportDataArray.filter((internshipImportData, index) => {
        if(internshipsWithCodes.find(internship => internship.code === internshipImportData.code)) {
          importErrors.push({
            row: startRow + index,
            property: 'code',
            message: `Internship with code ${internshipImportData.code} already exist`
          });

          return false;
        }

        if(!teachers.find(teacher => teacher.id === internshipImportData.teacherId)) {
          importErrors.push({
            row: startRow + index,
            property: 'teacher',
            message: `Teacher with id ${internshipImportData.teacherId} not exist`
          });

          return false;
        }

        return true;
      });

      await this.internshipRepository.import(internshipImportDataArray, request.ignoreErrors);
      return {result: request.ignoreErrors ? true : !importErrors.length, errors: importErrors};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async importPublications(request: ImportRequest): Promise<ImportResponse> {
    try {
      const workbook = new Workbook();
      const file = await request.file;
      const template = await workbook.xlsx.read(file.createReadStream());
      const worksheet = template.getWorksheet(1);

      const importErrors: Array<ImportErrorResponse> = [];
      let publicationImportDataArray: Array<PublicationImportData> = [];
      let startRow = request.from ?? ImportService.START_ROW;
      let currentRow = startRow;

      while (true) {
        const row = worksheet.getRow(currentRow);

        //read data from row
        const publicationImportData = new PublicationImportData();
        publicationImportData.title = String(row.getCell(PublicationImportColumnsEnum.TITLE).value ?? '');
        publicationImportData.date = new Date(String(row.getCell(PublicationImportColumnsEnum.DATE).value ?? ''));

        if(row.getCell(PublicationImportColumnsEnum.PUBLISHER).value) {
          publicationImportData.publisher = String(row.getCell(PublicationImportColumnsEnum.PUBLISHER).value ?? '');
        }

        if(row.getCell(PublicationImportColumnsEnum.URL).value) {
          publicationImportData.url = String(row.getCell(PublicationImportColumnsEnum.URL).value ?? '');
        }

        if(row.getCell(PublicationImportColumnsEnum.ANOTHER_AUTHORS).value) {
          publicationImportData.anotherAuthors = String(row.getCell(PublicationImportColumnsEnum.ANOTHER_AUTHORS).value ?? '');
        }

        if(row.getCell(PublicationImportColumnsEnum.DESCRIPTION).value) {
          publicationImportData.description = String(row.getCell(PublicationImportColumnsEnum.DESCRIPTION).value ?? '');
        }

        if(row.getCell(PublicationImportColumnsEnum.TEACHERS).value) {
           publicationImportData.teacherIds = row.getCell(PublicationImportColumnsEnum.TEACHERS).value
             .toString().split('\n').map(el => Number(el.split(' - ')[0]));
        }

        if((isNil(request.to) && !isFilledWithData(row)) || (!isNil(request.to) && currentRow <= request.to)) {
          break;
        }
        else {
          //data validation of row
          const validationErrors = await validate(publicationImportData);
          validationErrors.forEach(validationError => {
            Object.values(validationError.constraints).map(errorMessage => {
              importErrors.push({row: currentRow, property: validationError.property, message: errorMessage});
            });
          });

          //add row to import if valid
          if(!validationErrors.length) {
            publicationImportDataArray.push(publicationImportData);
          }

          currentRow++;
        }
      }

      if(!publicationImportDataArray.length && !importErrors.length) {
        importErrors.push({message: 'No data to import'});
      }

      //logic validation
      let existTeachers: Array<number> = [];

      publicationImportDataArray = publicationImportDataArray.filter(publicationImportData => {
        existTeachers = existTeachers.concat(publicationImportData.teacherIds);
        return true;
      });

      //local file validation without database end
      if(!request.ignoreErrors && importErrors.length) {
        return {result: false, errors: importErrors};
      }

      //get data to validate unique
      let teachers: Array<TeacherDbModel> = [];

      if(existTeachers.length) {
        const getTeachersRequest = this.importMapper.initializeGetTeachersByIds(uniq(existTeachers));
        const teacherResponse = await this.teacherRepository.getTeachers(getTeachersRequest);
        teachers = teacherResponse.data.responseList;
      }

      publicationImportDataArray = publicationImportDataArray.filter((publicationImportData, index) => {
        const notExistIds = publicationImportData.teacherIds.filter(teacherId => {
          return !teachers.find(teacher => teacher.id === teacherId);
        });

        if(notExistIds.length) {
          importErrors.push({
            row: startRow + index,
            property: 'teachers',
            message: `Teachers with ids ${notExistIds.join(', ')} not exist`
          });

          return false;
        }

        return true;
      });

      await this.publicationRepository.import(publicationImportDataArray, request.ignoreErrors);
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
