import { NewMessageWebhookBody } from "./dto/new-message-webhook-body";

export const newMessageWebhook = async (event) => {
  const body: NewMessageWebhookBody = JSON.parse(event.body);
  const answer = `You said: ${body.message}. That's the answer.`;
  return {
    statusCode: 200,
    body: answer,
  };
};
