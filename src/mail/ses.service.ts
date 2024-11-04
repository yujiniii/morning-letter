import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { SESClientConfig } from '@aws-sdk/client-ses/dist-types/SESClient';
import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateDto, SendMailDto } from './mail.dto'; // ES Modules import

@Injectable()
export class SesService {
  private client: SESClient;
  private DEFAULT_CHARSET = 'UTF-8';

  constructor(private readonly configService: ConfigService) {
    const config: SESClientConfig = {};
    this.client = new SESClient(config);
  }

  async sendMail(to: string, subject: string, dto: EmailTemplateDto) {
    const resultHtml = await ejs.renderFile(
      'src/views/email-template.ejs',
      dto,
    );

    const sendOption: SendMailDto = {
      to,
      subject,
      html: resultHtml,
    };

    const command = await this.getCommand(sendOption);
    const response = await this.client.send(command);

    return response.MessageId;
  }

  async getCommand(dto: SendMailDto) {
    const input = {
      Source: this.configService.get<string>('AWS_SES_SOURCE'),
      Destination: {
        ToAddresses: [dto.to],
      },
      ReturnPathArn: this.configService.get<string>('AWS_SES_RETURN_ARN'),
      Message: {
        Subject: {
          Data: dto.subject,
          Charset: this.DEFAULT_CHARSET,
        },
        Body: {
          Html: {
            Data: dto.html,
            Charset: this.DEFAULT_CHARSET,
          },
        },
      },
    };

    return new SendEmailCommand(input);
  }
}
