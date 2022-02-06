import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';
import {GqlExecutionContext} from '@nestjs/graphql';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('Requests logger');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);
    this.logger.log({body: gqlContext.getContext().req.body, headers: gqlContext.getContext().req.headers});

    return next.handle()
      .pipe(tap(resp => this.logger.log(JSON.stringify(resp))));
  }
}
