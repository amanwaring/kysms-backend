import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";

export interface AiService {
  getAnswer(question: string, additionalContext: string): Promise<string>;
};

export class AiServiceImpl implements AiService {
  anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic();
  }

  async getAnswer(question: string, additionalContext: string): Promise<string> {
    const content = `
    <documents>
      <document index="0">
        ${additionalContext}
      </document>
    </documents>
    In 160 characters or less, answer the following question: ${question}.
    Don't repeat the question in your answer. Only provide the succinct answer.`;
    const answer = await this.getAnswerFromAnthropic(content);
    return answer;
  }

  private async getAnswerFromAnthropic(content: string): Promise<string> {
    console.log('getting answer from anthropic');
    const aiResponse = await this.anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL!,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content,
      }]
    });
    console.log('answer received');
    const answer = (aiResponse.content[0] as TextBlock).text;
    return answer;
  }
}