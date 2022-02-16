import {MiddlewareConsumer, Module} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {CommissionModule} from './features/commission/commission.module';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
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
import {AuthorizationHeaderMiddleware} from './global/middlewares/authorization-header.middleware';
import {AuthModule} from './features/auth/auth.module';
import {IsAuthorisedGuard} from './global/guards/is-authorised-guard.service';
import {LoggerInterceptor} from './global/interceptors/logger.interceptor';
import {RoleGuard} from './global/guards/role.guard';
import {HonorModule} from './features/honor/honor.module';
import {RebukeModule} from './features/rebuke/rebuke.module';
import {PublicationModule} from './features/publication/publication.module';
import {ProfileModule} from './features/profile/profile.module';
import {InternshipModule} from './features/internship/internship.module';
import {EducationQualificationModule} from './features/education-qualification/education-qualification.module';
import {EducationModule} from './features/education/education.module';
import {CategoryModule} from './features/category/category.module';

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
      synchronize: false,
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        const originalError = error.originalError;

        if (originalError instanceof CustomArrayError) {
          return {
            message: originalError.message,
            code: originalError.code,
            errors: originalError.errors
          };
        } else if (originalError instanceof CustomError) {
          return {
            message: originalError.message,
            code: originalError.code,
          };
        } else {
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
    AuthModule,
    HonorModule,
    RebukeModule,
    PublicationModule,
    ProfileModule,
    InternshipModule,
    EducationQualificationModule,
    EducationModule,
    CategoryModule,
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
    {
      provide: APP_GUARD,
      useClass: IsAuthorisedGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationHeaderMiddleware).forRoutes('');
  }
}
