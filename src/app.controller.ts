import { Controller, Get, Logger, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron } from '@nestjs/schedule';
import { City } from './modules/public-data/public-data-helper/city.constant';
import { SesService } from './mail/ses.service';
import { UserDto } from './user/user.dto';
import { EmailTemplateDto } from './mail/mail.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly CHUNK_SIZE = 50;

  constructor(
    private readonly appService: AppService,
    private readonly sesService: SesService,
  ) {}

  @Cron('0 7 * * *', {
    name: 'send-email',
  })
  async handleCron() {
    const { headerImage, todayDate, unsubscribeLink } =
      this.appService.getEmailMetadata();
    // get users
    const users: UserDto[] = [
      { email: '', city: '' },
      { email: '', city: '' },
    ];
    // get news
    const news = await this.appService.get10News();
    // make chunks
    let userChunkGroups: UserDto[][] = [];
    const chunkSize = this.CHUNK_SIZE;
    for (let i = 0; i < users.length; i += chunkSize) {
      userChunkGroups.push(users.slice(i, i + chunkSize));
    }
    // iterate
    for (const chunk of userChunkGroups) {
      for (const user of chunk) {
        // get data
        const data = await this.appService.parseEmailDto(user.city);
        // send email
        await this.sesService.sendMail(
          user.email,
          `[Morning Letter] ${todayDate}, ${City[user.city].name} 오전 리포트`,
          {
            ...data,
            news,
            headerImage,
            todayDate,
            unsubscribeLink: `${unsubscribeLink}?email=${user.email}`,
          },
        );
        this.logger.log(`send email to ${user.email}`);
      }
    }
  }

  @Get('sample')
  @Render('email-template.ejs')
  async seeView(): Promise<EmailTemplateDto> {
    const { headerImage, todayDate, unsubscribeLink } =
      this.appService.getEmailMetadata();
    const user: UserDto = { email: 'yujiniii@icloud.com', city: 'seoul' };
    const news = await this.appService.get10News();
    const coreValues = await this.appService.parseEmailDto(user.city);
    // send email - nodemailer
    // await this.emailService.(..);

    // send email - AWS SES
    await this.sesService.sendMail(
      user.email,
      `[Morning Letter] ${todayDate}, ${City[user.city].name} 오전 리포트`,
      {
        ...coreValues,
        news,
        headerImage,
        todayDate,
        unsubscribeLink: `${unsubscribeLink}?email=${user.email}`,
      },
    );

    return {
      ...coreValues,
      news,
      headerImage,
      todayDate,
      unsubscribeLink: `${unsubscribeLink}?email=${user.email}`,
    };
  }
}
