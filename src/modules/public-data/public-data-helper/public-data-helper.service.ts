import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PublicDataHelperService {
  constructor(private readonly httpService: HttpService) {}

  getErrorMessage(resultCode: string): string | undefined {
    switch (resultCode) {
      case '00':
        break;
      case '01':
        return '어플리케이션 에러';
      case '02':
        return '데이터베이스 에러';
      case '03':
        return '데이터 없음';
      case '04':
        return 'HTTP 에러';
      case '05':
        return '서비스 연결 실패 에러';
      case '10':
        return '잘못된 요청 파라미터 에러';
      case '11':
        return '필수 요청 파라미터 없음';
      case '12':
        return '해당 오픈API 서비스가 없거나 폐기됨';
      case '20':
        return '서비스 접근 거부';
      case '21':
        return '일시적으로 사용할 수 없는 서비스 키';
      case '22':
        return '서비스 요청 제한 횟수 초과 에러';
      case '30':
        return '등록하지 않은 서비스키';
      case '31':
        return '서비스키 사용 기간 만료';
      case '32':
        return '등록하지 않은 도메인명 또는 IP주소';
      case '34':
        return '보고서가 등록 되지 않음';
      case '99':
        return '기타 에러';
      default:
        return '데이터 서버로부터 알 수 없는 에러가 발생';
    }
  }

  async callApiAndParse<T, K>(
    url: string,
    parse: (result: K) => T,
  ): Promise<T> {
    const { data: result } = await firstValueFrom(this.httpService.get(url));
    const { response } = result;
    if (!response?.header || response?.header?.resultCode !== '00') {
      throw new BadRequestException(
        this.getErrorMessage(response?.header?.resultCode),
      );
    }
    return parse(response.body);
  }
}
