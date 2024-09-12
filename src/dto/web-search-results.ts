export interface SearchEngineResults {
  items: SearchEngineResultItem[];
}

export interface SearchEngineResultItem {
  title: string;
  link: string;
  snippet: string;
}