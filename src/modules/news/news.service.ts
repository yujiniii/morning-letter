import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as parser from 'node-html-parser';
import { NewsDto } from './news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  // 네이버 뉴스 메인 페이지를 접속했을 때 나오는 뉴스 (5개) 를 가져옵니다
  async getNaverNewsMainPage(): Promise<NewsDto[]> {
    const url = 'https://news.naver.com/';

    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'text',
        headers: { Accept: 'text/html' },
      }),
    );
    const root = parser.parse(data);
    const cards = root.querySelector('._preview_card_page');
    if (!cards) {
      throw new BadRequestException('네이버 뉴스를 가져오는데 실패했습니다');
    }
    const childNodes = cards.querySelectorAll('.cjs_journal_wrap');

    return childNodes.map((article): NewsDto => {
      const link = article.querySelector('a.cjs_news_a');
      const img = article.querySelector('img');
      const headline = article.querySelector('.cjs_t');

      return {
        href: link ? link.getAttribute('href') : null,
        imgSrc: img ? img.getAttribute('src') : null,
        headline: headline ? headline.text : null,
      };
    });
  }
}
