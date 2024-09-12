import * as puppeteer from "puppeteer";

export interface WebScrapeService {
  getPageContent(link: string): Promise<string>;
}

export class WebScrapeServiceImpl implements WebScrapeService {

  async getPageContent(link: string): Promise<string> {
    console.log('launching puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('going to link:', link);
    await Promise.race([
      page.goto(link, { waitUntil: 'networkidle2' }),
      new Promise<void>(resolve => setTimeout(() => {
        console.log('continuing after 5 seconds');
        resolve();
      }, 5000))
    ]);
    console.log('page loaded');
    const innerText = await page.evaluate(() => document.body.innerText);
    console.log(innerText);
    await browser.close();
    return innerText;
  }
}