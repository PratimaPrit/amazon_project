const model = require('../config/gemini');

class GeminiService {
  async optimizeTitle(originalTitle, requestId = 'unknown') {
    console.log(`[${requestId}] AI: Optimizing title`);
    const prompt = `You are an Amazon listing optimization expert specializing in SEO and conversion optimization.

Original Amazon product title:
"${originalTitle}"

Your task: Generate an improved product title that:
- Is keyword-rich but natural and readable
- Stays under 200 characters
- Includes primary benefits and key features
- Follows Amazon's title guidelines (no promotional language, proper capitalization)
- Optimizes for search visibility while maintaining customer appeal

Return ONLY the optimized title, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(`[${requestId}] AI: Title optimization complete`);
    return response.text().trim();
  }

  async optimizeBullets(originalBullets, requestId = 'unknown') {
    console.log(`[${requestId}] AI: Optimizing bullet points`);
    if (!originalBullets || originalBullets.length === 0) {
      return ['Feature information not available'];
    }

    const bulletsText = originalBullets.map((b, i) => `${i + 1}. ${b}`).join('\n');

    const prompt = `You are an Amazon listing optimization expert specializing in persuasive copywriting.

Original Amazon bullet points:
${bulletsText}

Your task: Rewrite these bullet points to be more effective by:
- Leading with benefits, not just features
- Being clear, concise, and scannable
- Using power words and action verbs
- Keeping each bullet under 250 characters
- Maintaining factual accuracy
- Following Amazon's guidelines (no promotional claims like "best" or "perfect")

Return the result as a JSON array of strings, with 5 bullet points.
Format: ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"]

Return ONLY the JSON array, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.log(`[${requestId}] AI: Bullet points optimization complete`);
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: split by newlines if JSON parsing fails
    console.log(`[${requestId}] AI: Bullet points optimization complete (fallback)`);
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);
  }

  async optimizeDescription(originalDescription, title, requestId = 'unknown') {
    console.log(`[${requestId}] AI: Optimizing description`);
    const prompt = `You are an Amazon listing optimization expert specializing in persuasive product descriptions.

Product Title: ${title}

Original Description:
${originalDescription}

Your task: Enhance this Amazon product description to be:
- More persuasive and engaging
- Better formatted with clear paragraphs
- Benefit-focused (explain how it improves customer's life)
- Compliant with Amazon policies (no promotional language, external links, or seller information)
- Around 250-300 words

Return ONLY the enhanced description, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(`[${requestId}] AI: Description optimization complete`);
    return response.text().trim();
  }

  async suggestKeywords(title, bullets, description, requestId = 'unknown') {
    console.log(`[${requestId}] AI: Generating keyword suggestions`);
    const context = `
Title: ${title}
Bullets: ${bullets.join(', ')}
Description: ${description.substring(0, 200)}...
`;

    const prompt = `You are an Amazon SEO expert specializing in keyword research.

Based on this product listing:
${context}

Your task: Suggest 3-5 high-intent keywords that:
- Aren't already heavily used in the current listing
- Have strong commercial search intent (customers ready to buy)
- Are relevant to the product category
- Could improve search visibility
- Are actual search terms customers use (not just features)

Return the result as a JSON array of strings.
Format: ["keyword 1", "keyword 2", "keyword 3"]

Return ONLY the JSON array, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.log(`[${requestId}] AI: Keyword suggestions complete`);
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback
    console.log(`[${requestId}] AI: Keyword suggestions complete (fallback)`);
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[\d\-*.]+\s*/, '').trim())
      .slice(0, 5);
  }

  async optimizeProduct(productData, requestId = 'unknown') {
    try {
      console.log(`[${requestId}] Starting parallel AI optimization (4 tasks)`);

      const [optimizedTitle, optimizedBullets, optimizedDescription, suggestedKeywords] =
        await Promise.all([
          this.optimizeTitle(productData.title, requestId),
          this.optimizeBullets(productData.bullets, requestId),
          this.optimizeDescription(productData.description, productData.title, requestId),
          this.suggestKeywords(
            productData.title,
            productData.bullets,
            productData.description,
            requestId
          )
        ]);

      console.log(`[${requestId}] AI optimization completed successfully`);

      return {
        optimizedTitle,
        optimizedBullets,
        optimizedDescription,
        suggestedKeywords
      };
    } catch (error) {
      console.error(`[${requestId}] Gemini optimization error:`, error.message);
      throw new Error('Failed to optimize product listing with AI');
    }
  }
}

module.exports = new GeminiService();
