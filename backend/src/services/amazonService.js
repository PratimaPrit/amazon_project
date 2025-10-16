const axios = require('axios');
const cheerio = require('cheerio');

class AmazonService {
  async getProductDetails(asin, requestId = 'unknown') {
    if (!this.isValidAsin(asin)) {
      throw new Error('Invalid ASIN format');
    }

    const domain = process.env.AMAZON_DOMAIN || 'amazon.in';
    const url = `https://www.${domain}/dp/${asin}`;

    console.log(`[${requestId}] Scraping Amazon URL: ${url}`);

    try {
      return await this.scrapeProduct(url, requestId);
    } catch (error) {
      console.error(`[${requestId}] Amazon scraping error:`, error.message);
      if (error.message.includes('Product not found')) {
        throw error;
      }
      throw new Error('Failed to fetch product details from Amazon');
    }
  }

  async scrapeProduct(url, requestId = 'unknown') {
    console.log(`[${requestId}] Making HTTP request to Amazon`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    if (!title) {
      console.error(`[${requestId}] Product not found - title element missing`);
      const error = new Error('Product not found');
      error.name = 'ProductNotFound';
      throw error;
    }

    console.log(`[${requestId}] Extracting product data (title: ${title.substring(0, 50)}...)`);
    const bullets = this.extractBullets($);
    const description = this.extractDescription($, bullets);

    console.log(
      `[${requestId}] Successfully scraped product: ${bullets.length} bullets, ${description.length} chars description`
    );

    return {
      title,
      bullets: bullets.filter(b => b.length > 0),
      description
    };
  }

  extractBullets($) {
    const bullets = [];
    let bulletElements;

    $('*').each((_, element) => {
      if ($(element).text().trim() === 'About this item') {
        const nextUl = $(element).nextAll('ul').first();
        if (nextUl.length > 0) {
          bulletElements = nextUl.find('li span.a-list-item');
          return false;
        }
      }
    });

    if (bulletElements && bulletElements.length > 0) {
      bulletElements.each((_, el) => {
        const text = $(el).text().trim();
        if (text) bullets.push(text);
      });
    }

    return bullets;
  }

  extractDescription($, bullets) {
    let description = '';

    $('*').each((_, element) => {
      if ($(element).text().trim() === 'Product description') {
        const nextContent = $(element).next('p, div').first();
        if (nextContent.length > 0) {
          description = nextContent.text().trim();
          return false;
        }
      }
    });

    if (!description && bullets.length > 0) {
      description = bullets.join(' ');
    }

    if (!description) {
      description = 'No description available';
    }

    return description;
  }

  isValidAsin(asin) {
    return /^[A-Z0-9]{10}$/.test(asin);
  }
}

module.exports = new AmazonService();
