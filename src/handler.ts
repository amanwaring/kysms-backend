import Anthropic from "@anthropic-ai/sdk";
import { NewMessageWebhookBody } from "./dto/new-message-webhook-body";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
import axios, { AxiosRequestConfig } from "axios";
import { GoogleSearchResults } from "./dto/google-search-results";

export const newMessageWebhook = async (event) => {
  try {
    const body: NewMessageWebhookBody = JSON.parse(event.body);
    const axiosConfig: AxiosRequestConfig = {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: body.message,
      }
    };
    const axiosResponse = await axios.get('https://www.googleapis.com/customsearch/v1', axiosConfig);
    const searchResults: GoogleSearchResults = axiosResponse.data;
    console.log(searchResults.items[0]);
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
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
