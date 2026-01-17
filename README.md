# OrderSapp Bot

OrderSapp is a WhatsApp bot for small stores to share product prices and take simple orders through chat.

## Requirements
- Node.js 18+
- PostgreSQL

## Setup
1) Install deps: `npm install`
2) Create `.env` with:
   - `DATABASE_URL` (PostgreSQL connection)
   - `GEMINI_API_KEY` (Google Gemini API key)
   - (optional) `TARGET_JID`, `MESSAGE`
3) Run migrations: `npm run drizzle:migrate`
4) Seed data (optional):
   - `psql $DATABASE_URL -f drizzle/0001_seed_products.sql`
   - `psql $DATABASE_URL -f drizzle/0002_seed_client_order.sql`

## Run
- Start API + WhatsApp: `npm start`
- Scan the QR code in terminal with WhatsApp.

## API
- `POST /ai` with JSON `{ "message": "..." }`
- `GET /products`
- `GET /clients`
- `GET /orders`

## WhatsApp
The bot listens to direct messages (not groups) and replies using the AI graph.

## Development
- To add products, update `drizzle/0001_seed_products.sql` and re-seed.
- Product schema lives in `src/db/schema.ts`.
