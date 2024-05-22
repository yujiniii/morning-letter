import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { City } from '../public-data-helper/city.constant';
import { PublicDataHelperService } from '../public-data-helper/public-data-helper.service';

@Injectable()
export class PublicDataWeatherService {
  private readonly GET_WEATHER_BY_CITY = 'getVilageFcst';

  constructor(
    private readonly configService: ConfigService,
    private readonly PublicDataHelperService: PublicDataHelperService,
  ) {}

  async getWeather(city: string) {
    const serviceKey = this.configService.get<string>('SERVICE_KEY_DECODED');
    let url = `${this.configService.get<string>('WEATHER_DATA_URL')}/${this.GET_WEATHER_BY_CITY}`;
    const { nx, ny } = this.getPosition(city);
    const { base_date, base_time } = this.getDateTimeToday();
    const query = qs.stringify({
      serviceKey,
      numOfRows: 200,
      pageNo: 1,
      dataType: 'json',
      base_date,
      base_time,
      nx,
      ny,
    });
    url += `?${query}`;
    console.log(url);
    return this.PublicDataHelperService.callApiAndParse(url, this.getParse);
  }

  getPosition(city: string) {
    return {
      nx: City[city].nx,
      ny: City[city].ny,
    };
  }

  getDateTimeToday() {
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
  getParse(result) {
    const useCategories = ['TMN', 'TMX', 'POP', 'WSD']; // 최저기온, 최고기온, 강수확률, 풍속

    const parsed = [];
    result.items.item.map((item) => {
      // useCategories에 포함된 category만 추출
      if (useCategories.includes(item.category)) {
        parsed.push({
          category: item.category,
          dateTime: `${item.fcstDate}${item.fcstTime}`,
          value: item.fcstValue,
        });
      }
    });
    return parsed;
  }
}
