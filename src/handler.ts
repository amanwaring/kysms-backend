import Anthropic from "@anthropic-ai/sdk";
import { NewMessageWebhookBody } from "./dto/new-message-webhook-body";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

export const newMessageWebhook = async (event) => {
  const body: NewMessageWebhookBody = JSON.parse(event.body);
  const anthropic = new Anthropic();
  const aiResponse = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: body.message
    }]
  })
  const answer = (aiResponse.content[0] as TextBlock).text;
  return {
    statusCode: 200,
    body: answer,
  };
};
