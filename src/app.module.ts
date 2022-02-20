import {Logger, MiddlewareConsumer, Module, OnApplicationBootstrap} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {WinstonModule} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
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
import {AttestationModule} from './features/attestation/attestation.module';
import {storage} from './global/utils/storage';
import {SetupRequestStorageMiddleware} from './global/middlewares/setup-request-storage.middleware';

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
        const logger = new Logger();
        const originalError = error.originalError;
        let formattedError;

        if (originalError instanceof CustomArrayError) {
          formattedError = {
            message: originalError.message,
            code: originalError.code,
            errors: originalError.errors
          };
        } else if (originalError instanceof CustomError) {
          formattedError = {
            message: originalError.message,
            code: originalError.code
          };
        } else {
          formattedError = {
            message: error.message,
            code: ErrorCodesEnum.GENERAL
          }
        }

        logger.error({...formattedError, stack: (originalError || error).stack});
        return formattedError;
      }
    }),
    WinstonModule.forRoot({
      levels: winston.config.syslog.levels,
      transports: [
        // console output
        new winston.transports.Console({
          level: process.env.LOGS_LEVEL,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf((info) => {
              const store = storage.getStore();
              const logData = JSON.stringify({...info, level: undefined, message: undefined, context: undefined, timestamp: undefined});
              return `[App] ${info.timestamp} ${info.level}: ${store?.reqId ? `[Request id: ${store.reqId}] ` : ''}` +
                `${store?.ip ? `[IP: ${store.ip}]` : ''} ${info.context ? `[${info.context}] ` : ''}${info.message} ${logData}`;
            }),
          )
        }),

        // file output
        new winston.transports.DailyRotateFile({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.simple(),
            winston.format.printf((info) => {
              const store = storage.getStore();
              const logData = JSON.stringify({...info, level: undefined, message: undefined, context: undefined, timestamp: undefined});
              return `${info.timestamp} ${info.level}: ${store?.reqId ? `[Request id: ${store.reqId}] ` : ''}` +
                `${store?.ip ? `[IP: ${store.ip}]` : ''} ${info.context ? `[${info.context}] ` : ''}${info.message} ${logData}`;
            }),
          ),
          dirname: process.env.LOGS_DIR,
          filename: '%DATE%.log',
          options: {
            encoding: 'utf-8',
            flags: 'a'
          },
          maxFiles: '14d',
          maxSize: '10m',
          datePattern: 'YYYY-MM-DD-HH',
          level: process.env.LOGS_LEVEL
        })
      ]
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
    AttestationModule,
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
export class AppModule implements OnApplicationBootstrap {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  onApplicationBootstrap() {
    const config = fs.readFileSync(process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production');
    this.logger.log(`App started with config: ${config}`);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetupRequestStorageMiddleware, AuthorizationHeaderMiddleware).forRoutes('');
  }
}
