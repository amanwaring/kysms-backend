import { NewMessageWebhookBody } from "./dto/new-message-webhook-body";
import { SearchEngineService, SearchEngineServiceImpl } from "./service/search-engine.service";
import { WebScrapeService, WebScrapeServiceImpl } from "./service/web-scrape.service";
import { AiService, AiServiceImpl } from "./service/ai.service";

const searchEngineService: SearchEngineService = new SearchEngineServiceImpl();
const webScrapeService: WebScrapeService = new WebScrapeServiceImpl();
const aiService: AiService = new AiServiceImpl();

export const newMessageWebhook = async (event) => {
  try {
    const body: NewMessageWebhookBody = JSON.parse(event.body);
    
    const searchResults = await searchEngineService.search(body.message);
    const firstResult = searchResults.items[0];
    const pageContent = await webScrapeService.getPageContent(firstResult.link);
    const answer = await aiService.getAnswer(body.message, pageContent);
    
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
