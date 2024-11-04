import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { City } from '../public-data-helper/city.constant';
import { PublicDataHelperService } from '../public-data-helper/public-data-helper.service';
import {
  WeatherDto,
  WeatherHourlyDto,
  WeatherStatusDto,
} from './public-weather.dto';

type WeatherTimeQuery = {
  base_date: string;
  base_time: string;
};

type WeatherPositionQuery = {
  nx: number;
  ny: number;
};

@Injectable()
export class PublicDataWeatherService {
  private readonly GET_WEATHER_BY_CITY = 'getVilageFcst';

  constructor(
    private readonly configService: ConfigService,
    private readonly PublicDataHelperService: PublicDataHelperService,
  ) {}

  async getWeather(city: string): Promise<WeatherDto> {
    const serviceKey = this.configService.get<string>('SERVICE_KEY_DECODED');
    let url = `${this.configService.get<string>('WEATHER_DATA_URL')}/${this.GET_WEATHER_BY_CITY}`;
    const { nx, ny } = this.getPosition(city);
    const { base_date, base_time } = this.getDateTimeToday();
    const query = qs.stringify({
      serviceKey,
      numOfRows: 3000,
      pageNo: 1,
      dataType: 'json',
      base_date,
      base_time,
      nx,
      ny,
    });
    url += `?${query}`;
    return this.PublicDataHelperService.callApiAndParse(url, this.getParse);
  }

  getPosition(city: string): WeatherPositionQuery {
    return {
      nx: City[city].nx,
      ny: City[city].ny,
    };
  }

  getDateTimeToday(): WeatherTimeQuery {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {
      base_date: `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`,
      base_time: '0200',
    };
  }

  // todo: type 정의, 응답값 변경 필요
  getParse(response) {
    let parsed: WeatherDto = {
      maxTemp: 0,
      minTemp: 0,
      hourly: [],
    };

    let rainProbability: WeatherStatusDto[] = [];
    let sky: WeatherStatusDto[] = [];
    let pty: WeatherStatusDto[] = []; // 강수형태
    response.items.item.map((item) => {
      switch (item.category) {
        case 'TMN': // 최저기온
          parsed.minTemp = item.fcstValue;
          break;
        case 'TMX': // 최고기온
          parsed.maxTemp = item.fcstValue;
          break;
        case 'POP': // 강수확률
          rainProbability.push({
            value: item.fcstValue,
            time: `${item.fcstTime}`,
          });
          break;
        case 'SKY': // 하늘상태
          sky.push({
            value: item.fcstValue,
            time: `${item.fcstTime}`,
          });
          break;
        case 'PTY': // 강수형태
          pty.push({
            value: item.fcstValue,
            time: `${item.fcstTime}`,
          });
          break;
      }
    });
    parsed.hourly = rainProbability
      .map((item, index) => {
        const time = Number(item.time);
        if (time >= 700 && (time / 100) % 2 === 0) {
          // 7시 이후, 짝수 시간대만 추출
          return {
            time: item.time,
            rainProbability: item.value,
            sky: sky[index].value,
            pty: pty[index].value,
          };
        }
      })
      // Type Guard
      .filter((item): item is WeatherHourlyDto => item !== undefined);

    return parsed;
  }
}
