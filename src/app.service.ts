import { BadRequestException, Injectable } from '@nestjs/common';
import { NewsService } from './modules/news/news.service';
import { FortuneService } from './modules/fortune/fortune.service';
import { PublicDataWeatherService } from './modules/public-data/public-data-weather/public-data-weather.service';
import { PublicDataDustService } from './modules/public-data/public-data-dust/public-data-dust.service';
import { ConfigService } from '@nestjs/config';
import { NewsDto } from './modules/news/news.dto';
import { EmailTemplateDto, MailMetaDto } from './mail/mail.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly newService: NewsService,
    private readonly fortuneService: FortuneService,
    private readonly weatherService: PublicDataWeatherService,
    private readonly dustService: PublicDataDustService,
    private readonly configService: ConfigService,
  ) {}

  async getConcatenatedData(cityName: string) {
    return [
      await this.fortuneService.getFortuneFromOpenAi(),
      await this.weatherService.getWeather(cityName),
      await this.dustService.getPublicDataDust(cityName),
    ];
  }

  async get10News() {
    let news10: NewsDto[] = [];
    for (let i = 0; i < 2; i++) {
      const news5 = await this.newService.getNaverNewsMainPage();
      news10 = news10.concat(news5);
    }
    return news10;
  }

  async weather() {
    return await this.weatherService.getWeather('seoul');
  }

  async parseEmailDto(
    cityName: string,
  ): Promise<
    Omit<
      EmailTemplateDto,
      'news' | 'todayDate' | 'headerImage' | 'unsubscribeLink'
    >
  > {
    const [fortune, weather, dust] = await this.getConcatenatedData(cityName);
    return {
      fortune,
      weather: {
        ...weather,
        stationName: cityName,
      },
      dust,
    };
  }

  getEmailMetadata(): MailMetaDto {
    const headerImage = this.configService.get<string>(
      'MAIL_TEMPLATE_HEADER_IMAGE',
    );
    const unsubscribeLink = this.configService.get<string>(
      'MAIL_UNSUBSCRIBE_LINK',
    );
    if (!headerImage || !unsubscribeLink) {
      throw new BadRequestException('환경변수를 확인해주세요');
    }
    return {
      todayDate: this.parseDateString(),
      headerImage,
      unsubscribeLink,
    };
  }

  private parseDateString() {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  }
}
