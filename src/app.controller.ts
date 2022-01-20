import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAlive(): string {
    return 'It works';
  }
}
