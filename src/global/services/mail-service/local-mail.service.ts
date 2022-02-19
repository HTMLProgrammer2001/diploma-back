import {Injectable} from '@nestjs/common';
import {MailServiceInterface} from './mail-service.interface';

@Injectable()
export class LocalMailService extends MailServiceInterface {
  async sendTeacherLoginMail(email: string, token: string): Promise<void> {
    console.log(`${email}:${token}`);
  }
}
