import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { DustGrade } from './public-data-dust.constant';
import { City } from '../public-data-helper/city.constant';
import { PublicDataHelperService } from '../public-data-helper/public-data-helper.service';

enum DustApiType {
  GET_DUST_BY_CITY = 'getCtprvnRltmMesureDnsty',
}

@Injectable()
export class PublicDataDustService {
  constructor(
    private readonly configService: ConfigService,
    private readonly PublicDataHelperService: PublicDataHelperService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPublicDataDust(sidoName: string) {
    const serviceKey = this.configService.get<string>('SERVICE_KEY_DECODED');
    let url = `${this.configService.get<string>('DUST_DATA_URL')}/${DustApiType.GET_DUST_BY_CITY}`;
    const query = qs.stringify({
      sidoName: City[sidoName].name,
      pageNo: 1,
      numOfRows: 10,
      returnType: 'json',
      serviceKey,
      ver: '1.0',
    });
    url += `?${query}`;
    console.log(url);
    return this.PublicDataHelperService.callApiAndParse(url, this.getParse);
  }

  // todo: type 정의
  getParse(result) {
    return {
      pm10: DustGrade[`${result.items[0]?.pm10Grade}`],
      pm25: DustGrade[`${result.items[0]?.pm25Grade}`],
      stationName: result.items[0].stationName,
    };
  }
}
