import {Module} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {DataModule} from './data/data.module';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {CommissionModule} from './features/commission/commission.module';
import {APP_FILTER} from '@nestjs/core';
import {ValidationErrorFilter} from './common/filters/validation-error.filter';
import {BaseError} from './common/class/base-error';
import {AllErrorFilter} from './common/filters/all-error.filter';
import {ErrorCodesEnum} from './common/constants/error-codes.enum';
import {DepartmentModule} from './features/department/department.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 31634,
      username: 'root',
      password: 'root',
      database: 'app',
      autoLoadModels: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        const customError = error.originalError;

        if(customError instanceof BaseError) {
          return {
            message: customError.error.message,
            code: customError.error.code,
          }
        }
        else {
          return {
            message: error.message,
            code: ErrorCodesEnum.GENERAL
          }
        }
      }
    }),

    DataModule,
    CommissionModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllErrorFilter
    },
    {
      provide: APP_FILTER,
      useClass: ValidationErrorFilter
    }
  ]
})
export class AppModule {
}
