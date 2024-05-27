import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './news.service';

describe('뉴스 서비스', () => {
  let newsService: NewsService;
  beforeEach(async () => {
    const tstModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: './.env' }), HttpModule],
      providers: [NewsService],
    }).compile();
    newsService = tstModule.get<NewsService>(NewsService);
  });
  it('뉴스 서비스가 존재한다.', () => {
    expect(newsService).toBeDefined();
  });

  it('네이버 뉴스 페이지를 파싱하여, 헤드라인을 가져온다', async () => {
    const parseFn = () => ({ value: 'test', message: 'success' });
    const data = await newsService.getNaverNewsMainPage();
    expect(data).toBeDefined();
    expect(data?.[0]).toHaveProperty('href');
    expect(data?.[0]).toHaveProperty('imgSrc');
    expect(data?.[0]).toHaveProperty('headline');
  });
});
