import {Module} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {CommissionModule} from './features/commission/commission.module';
import {APP_FILTER} from '@nestjs/core';
import {DepartmentModule} from './features/department/department.module';
import {RoleModule} from './features/role/role.module';
import {TeachingRankModule} from './features/teaching-rank/teaching-rank.module';
import {DataLayerModule} from './data-layer/data-layer.module';
import {AcademicDegreeModule} from './features/academic-degree/academic-degree.module';
import {AcademicTitleModule} from './features/academic-title/academic-title.module';
import {TeacherModule} from './features/teacher/teacher.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {ConfigModule} from '@nestjs/config';
import {GlobalModule} from './global/global.module';
import {CustomArrayError} from './global/class/custom-array-error';
import {CustomError} from './global/class/custom-error';
import {ErrorCodesEnum} from './global/constants/error-codes.enum';
import {AllErrorFilter} from './global/filters/all-error.filter';
import {ValidationErrorFilter} from './global/filters/validation-error.filter';
import {UserModule} from './features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static'
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: false
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
    GlobalModule,
    CommissionModule,
    DepartmentModule,
    RoleModule,
    TeachingRankModule,
    AcademicDegreeModule,
    AcademicTitleModule,
    TeacherModule,
    UserModule,
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
    },
  ]
})
export class AppModule {
}
