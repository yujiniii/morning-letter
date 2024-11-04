import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateDto } from './mail.dto';

@Injectable()
export class EmailService {
  private emailSender: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.emailSender = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_ADDRESS'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      // 서명받지 않은 사이트의 요청도 받음
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(to: string, subject: string, dto: EmailTemplateDto) {
    const emailTemplate = await ejs.renderFile(
      'src/views/email-template.ejs',
      dto,
    );

    const mailOptions = {
      front: this.configService.get<string>('EMAIL_ADDRESS'),
      to,
      subject,
      html: emailTemplate,
    };

    return this.emailSender.sendMail(mailOptions);
  }
}
