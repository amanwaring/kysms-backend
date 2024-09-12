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
    const numPagesToScrape = Number(process.env.NUM_PAGES_TO_SCRAPE)
    const pageScrapeIndexes = Array.from({ length: numPagesToScrape }, (_, i) => i);

    const promiseResults = await Promise.allSettled(
      pageScrapeIndexes.map(i => webScrapeService.getPageContent(searchResults.items[i].link)));
    const pageContents = promiseResults 
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    const answer = await aiService.getAnswer(body.message, pageContents);
    
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
