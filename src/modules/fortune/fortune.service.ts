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
    const { openAiModelId, openAiPromptAssistant, openAiPromptUser } =
      this.getSafeEnv();
    try {
      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await this.openai.chat.completions.create({
          model: openAiModelId,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: openAiPromptUser,
                },
              ],
            },
            {
              role: 'assistant',
              content: openAiPromptAssistant,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: openAiPromptUser,
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

  getSafeEnv() {
    const openAiModelId = this.configService.get<string>('OPENAI_MODEL_ID');
    const openAiPromptAssistant = this.configService.get<string>(
      'OPENAI_PROMPT_ASSISTANT',
    );
    const openAiPromptUser =
      this.configService.get<string>('OPENAI_PROMPT_USER');
    if (!(openAiModelId && openAiPromptAssistant && openAiPromptUser)) {
      throw new BadRequestException('env 촥인');
    }
    return {
      openAiModelId,
      openAiPromptAssistant,
      openAiPromptUser,
    };
  }
}
