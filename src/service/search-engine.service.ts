import { SearchEngineResults } from "../dto/web-search-results";
import axios, { AxiosRequestConfig } from "axios";

export interface SearchEngineService {
  search(query: string): Promise<SearchEngineResults>;
}

export class SearchEngineServiceImpl implements SearchEngineService {
  async search(query: string): Promise<SearchEngineResults> {
    const axiosConfig: AxiosRequestConfig = {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
      }
    };
    console.log('searching for:', query);
    const axiosResponse = await axios.get('https://www.googleapis.com/customsearch/v1', axiosConfig);
    console.log('end search');
    const searchResults: SearchEngineResults = axiosResponse.data;
    return searchResults;
  }
}