import {Module} from '@nestjs/common';
import {join} from 'path';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {DataModule} from './data/data.module';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {CommissionModule} from './features/commission/commission.module';

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
      formatError: (error: GraphQLError) => ({
        message: error.message,
        code: 1,
      })
    }),

    DataModule,
    CommissionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
