# Amazon Product Listing Optimizer

AI-powered web application that optimizes Amazon product listings using Google Gemini AI. Scrapes product details directly from Amazon.in product pages by ASIN, generates SEO-optimized content, and tracks optimization history with server-side pagination.

## Features

- **ASIN-based Product Scraping** - Retrieve product details from Amazon.in product pages using web scraping
- **AI-Powered Optimization** - Generate improved titles, bullet points, and descriptions using Gemini 2.0 Flash
- **Side-by-Side Comparison** - View original vs optimized content in a clean interface
- **Keyword Suggestions** - Get 3-5 high-intent keyword recommendations
- **Optimization History** - Server-side paginated history with search by ASIN/ID
- **Lazy Loading** - Fetch full optimization details only when viewing
- **Database Migrations** - Professional up/down migration system for version control
- **Request Logging** - Unique request ID tracking for end-to-end request tracing

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **Sequelize ORM** - MySQL interaction with object-relational mapping
- **MySQL** - Relational database with migrations
- **Cheerio** - Fast HTML parsing for Amazon product scraping
- **Axios** - HTTP client with realistic headers for web scraping
- **Google Gemini 2.0 Flash Experimental** - AI content optimization
- **UUID** - Unique request ID generation for logging and tracing

### Frontend
- **React 18** - UI framework with hooks
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls

### Database
- **Sequelize ORM** - Type-safe database queries with object mapping
- **MySQL 8.0+** with version-controlled migrations
- Up/down migration system for rollbacks
- Server-side pagination with LIMIT/OFFSET
- Optimized indexes on frequently queried columns

## Project Structure

```
amazon-listing-optimizer/
├── backend/
│   ├── migrations/                      # Database migrations
│   │   ├── 001_create_migrations_table/
│   │   │   ├── up.sql                  # Create migrations table
│   │   │   └── down.sql                # Drop migrations table
│   │   ├── 002_create_database/
│   │   │   ├── up.sql                  # Create database
│   │   │   └── down.sql                # Drop database
│   │   ├── 003_create_optimizations_table/
│   │   │   ├── up.sql                  # Create optimizations table
│   │   │   └── down.sql                # Drop optimizations table
│   │   ├── 004_add_indexes/
│   │   │   ├── up.sql                  # Add indexes
│   │   │   └── down.sql                # Drop indexes
│   │   └── migrate.js                  # Migration runner
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js             # Sequelize connection
│   │   │   ├── sequelize.config.js     # Sequelize configuration
│   │   │   └── gemini.js               # Gemini AI client
│   │   ├── services/
│   │   │   ├── amazonService.js        # Web scraping logic
│   │   │   ├── geminiService.js        # AI optimization
│   │   │   └── productService.js       # Business logic
│   │   ├── models/
│   │   │   ├── index.js                # Sequelize instance
│   │   │   ├── Optimization.js         # Sequelize model definition
│   │   │   └── optimizationModel.js    # Database queries with ORM
│   │   ├── controllers/
│   │   │   ├── productController.js    # Optimization endpoint
│   │   │   └── historyController.js    # History endpoints
│   │   ├── routes/
│   │   │   └── api.js                  # API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.js         # Error handling
│   │   │   └── requestLogger.js        # Request logging with UUID
│   │   └── server.js                   # Express server
│   ├── .sequelizerc                    # Sequelize CLI config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ASINInput.jsx           # ASIN input form
│   │   │   ├── ComparisonView.jsx      # Original vs Optimized
│   │   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   │   └── Navigation.jsx          # Nav bar
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Search & optimize page
│   │   │   └── HistoryPage.jsx         # History & pagination
│   │   ├── services/
│   │   │   └── api.js                  # Axios API client
│   │   ├── App.jsx                     # Main app with routing
│   │   ├── App.css                     # Global styles
│   │   └── main.jsx                    # React entry point
│   └── package.json
├── package.json                        # Root scripts
└── README.md
```

## Prerequisites

- **Node.js** 16+ and npm
- **MySQL** 8.0+ installed and running
- **Google Gemini API** key ([Get one here](https://makersuite.google.com/app/apikey))
- Internet connection (for web scraping and AI API calls)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd amazon-listing-optimizer
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key for use in `.env`

### 3. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=           # Leave empty if no password
DATABASE_NAME=amazon_optimizer

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Amazon Configuration
AMAZON_DOMAIN=amazon.in      # Scraping from Amazon India

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Run Database Migrations

**From project root:**
```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback last migration (if needed)
npm run migrate:down
```

**Or from backend directory:**
```bash
cd backend
npm run migrate
```

This creates:
- `amazon_optimizer` database
- `migrations` table (tracks executed migrations)
- `optimizations` table (stores optimization history)
- Index on `asin` column for ASIN searches

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

#### Configure Environment (optional)

```bash
cp .env.example .env
```

Edit `.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Dev Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Home Page - Optimize Products

1. Enter a valid Amazon ASIN (10 alphanumeric characters)
   - Example: `B08N5WRWNW` (Amazon.in product)
2. Click "Optimize"
3. Wait  for:
   - Web scraping from Amazon.in
   - AI optimization via Gemini
   - Database storage
4. View side-by-side comparison:
   - Original vs Optimized title
   - Original vs Optimized bullets
   - Original vs Optimized description
   - AI-suggested keywords

### History Page - View Past Optimizations

1. Click "History" in navigation
2. Browse paginated list (10 items per page)
3. Use "Next/Previous" buttons to navigate
4. **Search functionality:**
   - Enter ASIN to search by product
   - Enter number to search by ID
   - Click "Clear" to reset
5. Click "View Details" to see full optimization
   - Lazy loads complete data from database
   - Modal shows all original vs optimized content

## API Documentation

### Endpoints

#### `POST /api/optimize`
Optimize a product listing by ASIN

**Request:**
```json
{
  "asin": "B08N5WRWNW"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "asin": "B08N5WRWNW",
    "original": {
      "title": "...",
      "bullets": ["..."],
      "description": "..."
    },
    "optimized": {
      "title": "...",
      "bullets": ["..."],
      "description": "...",
      "keywords": ["..."]
    }
  }
}
```

#### `GET /api/history`
Get paginated optimization history

**Query Parameters:**
- `limit` (optional) - Records per page (default: 10)
- `offset` (optional) - Starting position (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asin": "B08N5WRWNW",
      "original": { "title": "..." },
      "createdAt": "2025-10-15T12:00:00.000Z"
    }
  ]
}
```

#### `GET /api/history/asin/:asin`
Search optimization history by ASIN

#### `GET /api/history/:id`
Get single optimization with full details (for "View Details" modal)

## Architecture & Design Decisions

### 1. Web Scraping Setup

**Why Web Scraping Instead of API?**
- Amazon Product Advertising API requires approval and has restrictions
- Web scraping provides direct access to public product data
- No API keys or approval process needed

**Implementation - Cheerio Only:**
- Fast and lightweight HTML parsing
- Realistic browser headers to avoid detection
- Configurable domain (currently `amazon.in`)

**Scraping Strategy:**
```javascript
// Extract title
$('#productTitle').text().trim()

// Extract bullets - searches for "About this item" heading
// Then extracts <li> items from next <ul>
$('*').each((_, el) => {
  if ($(el).text().trim() === 'About this item') {
    // Get bullets from next <ul>
  }
})

// Extract description - searches for "Product description"
$('*').each((_, el) => {
  if ($(el).text().trim() === 'Product description') {
    // Get description from next <p> or <div>
  }
})
```

**Why This Approach?**
- Amazon's HTML structure varies by product
- Generic selectors like `#feature-bullets` don't always work
- Searching for "About this item" text is more reliable
- Works across different Amazon product page layouts

### 2. Database Migration System

**Up/Down Migrations:**
```
migrations/
├── 001_create_migrations_table/
│   ├── up.sql    # Create table
│   └── down.sql  # Drop table (for rollback)
```

**Benefits:**
- Version control for database schema
- Rollback capability (`npm run migrate:down`)
- Safe team collaboration
- Clear audit trail of changes

### 3. Gemini AI Prompt Engineering

**Model:** `gemini-2.0-flash-exp` (Fast and experimental)

**Prompt Strategy - Role-based with Constraints:**

```text
You are an Amazon listing optimization expert specializing in SEO.

Original Title: [...]

Your task:
- Keyword-rich but natural
- Under 200 characters
- No promotional language ("best", "perfect")
- Amazon policy compliant

Return ONLY the optimized title, nothing else.
```

**Why This Works:**
1. **Clear role** - AI understands context
2. **Specific constraints** - Prevents hallucinations
3. **Output format** - "Return ONLY..." ensures clean responses
4. **JSON for arrays** - Bullets/keywords returned as JSON arrays

**Parallel Execution:**
```javascript
await Promise.all([
  optimizeTitle(title),
  optimizeBullets(bullets),
  optimizeDescription(desc),
  suggestKeywords(data)
])
```
All 4 AI calls run simultaneously for ~4x speed improvement.

### 4. Frontend Architecture

**Two-Page Design:**
- **HomePage** - Search and optimize products
- **HistoryPage** - View past optimizations

**Why Separate Pages?**
- Clear separation of concerns
- Better UX (focused workflows)
- Easier to maintain and extend

**Performance Optimizations:**
- Lazy loading - Full details fetched only on "View Details"
- Server-side pagination - Fetches 11 items, shows 10
- Numeric sorting - `ORDER BY id ASC` (1, 2, 3... not 1, 11, 12, 2...)

### 5. Server-Side Pagination

**Fetch N+1 Strategy:**
```javascript
// Fetch 11 items when limit is 10
const response = await getHistory(10 + 1, offset)

// Show first 10
const pageData = response.data.slice(0, 10)

// Use 11th to determine if "Next" button should be enabled
const hasMore = response.data.length > 10
```

Efficient database queries with no separate COUNT(*) query needed. "Next" button automatically disabled on last page.

### 6. Request Logging & Tracing

**Comprehensive Request Tracking:**
Every incoming request is assigned a unique UUID (v4) that tracks the request through its entire lifecycle across all services and components.

**Logging Features:**
- **Request ID**: Unique UUID generated for each request
- **Request Metadata**: Timestamp, HTTP method, URL, request body
- **Response Tracking**: Status code, response time (ms), full response data
- **Error Tracking**: All errors logged with request ID for easy debugging
- **Service-Level Logging**: Each service (Amazon scraping, AI optimization, database) logs operations with request ID


## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL if not running
brew services start mysql

# Test connection
mysql -u root -p
```

### Migration Errors
```bash
# Drop database and start fresh
mysql -u root -p -e "DROP DATABASE IF EXISTS amazon_optimizer"

# Re-run migrations
npm run migrate
```

### Web Scraping Fails
- **Error: Product not found** - ASIN might be invalid or product delisted
- **Error: Amazon blocked request** - Amazon detected bot behavior
  - Solution: Wait a few minutes before retrying
  - Use different ASIN to test
- **Error: No bullets found** - Amazon page structure changed
  - Check browser console for scraper logs

### Gemini API Errors
- **503 Service Unavailable** - Gemini API overloaded
  - Solution: Wait a few minutes and retry
  - Check API quota at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **401 Unauthorized** - Invalid API key
  - Verify `GEMINI_API_KEY` in `.env`

## Root-Level Scripts

Run from project root directory:

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Run database migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:down

# Reset database (drop and recreate fresh)
npm run migrate:reset

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Start both (requires concurrently package)
npm run dev
```

## Implementation Logic

### Data Fetching Flow
1. **User Input**: ASIN validated (10 alphanumeric characters)
2. **Web Scraping**: Cheerio extracts product data from Amazon.in
   - Title: Direct selector `$('#productTitle')`
   - Bullets: Search for "About this item" text, extract next `<ul>` elements
   - Description: Search for "Product description" text, extract next `<p>` or `<div>`
3. **AI Optimization**: 4 parallel Gemini API calls via `Promise.all()`
   - Title optimization (under 200 chars, SEO-focused)
   - Bullet points rewrite (5 benefit-driven points)
   - Description enhancement (persuasive, 250-300 words)
   - Keyword suggestions (3-5 high-intent terms)
4. **Database Storage**: Insert into MySQL with JSON stringified arrays
5. **Response**: Return original + optimized data to frontend

### Prompt Engineering Strategy
**Role-based prompts with strict constraints:**
- Clear expert role ("Amazon listing optimization expert")
- Specific requirements (character limits, no promotional language)
- Output format enforcement ("Return ONLY the optimized title, nothing else")
- JSON array format for structured data (bullets, keywords)

### Server-Side Pagination Logic
**N+1 Fetch Strategy:**
- Request 11 items when limit is 10
- Display first 10 items
- Use existence of 11th item to enable/disable "Next" button
- No separate COUNT(*) query needed
- Numeric sorting: `ORDER BY id ASC`

### Error Handling
- ASIN validation before API call
- Axios timeout: 60 seconds for AI processing
- Fallback descriptions when scraping fails
- JSON parsing with regex fallback for AI responses
- Centralized error middleware with specific error types

## License

MIT License
