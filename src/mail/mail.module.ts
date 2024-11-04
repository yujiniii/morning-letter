import { Module } from '@nestjs/common';
import { SesService } from './ses.service';
import { EmailService } from './mail.service';

@Module({
  providers: [SesService, EmailService],
  exports: [SesService],
})
export class MailModule {}
