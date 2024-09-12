export interface GoogleSearchResults {
  items: GoogleSearchResultItem[];
}

export interface GoogleSearchResultItem {
  title: string;
  link: string;
  snippet: string;
}