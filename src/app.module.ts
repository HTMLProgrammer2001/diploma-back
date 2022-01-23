import {Module} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {CommissionModule} from './features/commission/commission.module';
import {APP_FILTER} from '@nestjs/core';
import {ValidationErrorFilter} from './common/filters/validation-error.filter';
import {CustomError} from './common/class/custom-error';
import {AllErrorFilter} from './common/filters/all-error.filter';
import {ErrorCodesEnum} from './common/constants/error-codes.enum';
import {DepartmentModule} from './features/department/department.module';
import {CustomArrayError} from './common/class/custom-array-error';
import {RoleModule} from './features/role/role.module';
import {TeachingRankModule} from './features/teaching-rank/teaching-rank.module';
import {DataLayerModule} from './data-layer/data-layer.module';

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
        const originalError = error.originalError;

        if(originalError instanceof CustomArrayError){
          return {
            message: originalError.message,
            code: originalError.code,
            errors: originalError.errors
          };
        }
        else if(originalError instanceof CustomError) {
          return {
            message: originalError.message,
            code: originalError.code,
          };
        }
        else {
          return {
            message: error.message,
            code: ErrorCodesEnum.GENERAL,
          }
        }
      }
    }),

    DataLayerModule,
    CommissionModule,
    DepartmentModule,
    RoleModule,
    TeachingRankModule,
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
