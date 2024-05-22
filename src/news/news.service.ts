import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as parser from 'node-html-parser';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  async getNaverNewsMainPage() {
    const url = 'https://news.naver.com/';

    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'text',
        headers: { Accept: 'text/html' },
      }),
    );
    const root = parser.parse(data);
    const childNodes = root.querySelectorAll('._preview_card_page');

    return childNodes.map((article) => {
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
