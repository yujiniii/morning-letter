import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PublicDataHelperService } from './public-data-helper.service';
import { HttpModule } from '@nestjs/axios';

describe('공공 API HELPER 서비스', () => {
  let helperService: PublicDataHelperService;
  let url =
    'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0';
  beforeEach(async () => {
    const tstModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: './.env' }), HttpModule],
      providers: [PublicDataHelperService],
    }).compile();
    helperService = tstModule.get<PublicDataHelperService>(
      PublicDataHelperService,
    );
    url = url + '&serviceKey=' + process.env.SERVICE_KEY_ENCODED;
  });
  it('공공 API HELPER 서비스가 존재한다.', () => {
    expect(helperService).toBeDefined();
  });
  it('제공한 에러 코드에 맞춰 에러 메시지를 검출한다', async () => {
    const errorMessage = helperService.getErrorMessage('10');
    expect(errorMessage).toBe('잘못된 요청 파라미터 에러');
  });
  it('특정한 주소로 요청을 보내고, 그 요청을 파싱하여 응답한다.', async () => {
    const parseFn = () => ({ value: 'test', message: 'success' });
    const data = await helperService.callApiAndParse(url, parseFn);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('value');
    expect(data.value).toBe('test');
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('success');
  });
});
