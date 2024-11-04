import { WeatherWithStationDto } from '../modules/public-data/public-data-weather/public-weather.dto';
import { DustDto } from '../modules/public-data/public-data-dust/public-dust.dto';
import { NewsDto } from '../modules/news/news.dto';

export class SendMailDto {
  to: string;
  subject: string;
  html: string;
}

export class MailMetaDto {
  todayDate: string;
  headerImage: string;
  unsubscribeLink: string;
}

export class EmailTemplateDto {
  headerImage: string;
  todayDate: string;
  unsubscribeLink: string;
  weather: WeatherWithStationDto;
  dust: DustDto;
  fortune: string;
  news: NewsDto[];
}
