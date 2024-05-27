import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class FortuneService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getFortuneFromOpenAi(): Promise<any> {
    try {
      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await this.openai.chat.completions.create({
          model: this.configService.get<string>('OPENAI_MODEL_ID'),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: this.configService.get<string>('OPENAI_PROMPT_USER'),
                },
              ],
            },
            {
              role: 'assistant',
              content: this.configService.get<string>(
                'OPENAI_PROMPT_ASSISTANT',
              ),
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: this.configService.get<string>('FORTUNE_PROMPT_KOREAN'),
                },
              ],
            },
          ],
          // ⬇ set same as the playground
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

      return chatCompletion.choices[0].message.content;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
