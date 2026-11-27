# AlphaMetrics — Indian Stock Market Paper Trading

A paper-trading simulator for Indian equities. Practise NSE stock trading with virtual cash, track portfolio performance, and review simulated orders without placing real market trades.

## Features
- NSE-focused stock universe and watchlists
- Virtual starting balance and simulated buy/sell orders
- Portfolio holdings, average cost, realised and unrealised P&L
- Order history and dashboard analytics
- Demo/simulation price mode for practice outside market hours
- Optional live quote integration through the configured backend provider
- Price alerts and strategy backtesting

## Trading and data safety
- **Paper trading only.** No broker connection, real order routing, deposits, or withdrawals.
- Simulation prices are generated for practice and are not executable or official exchange prices.
- Live quote availability depends on the configured upstream provider, its terms, rate limits, and market hours. Display the provider timestamp and data mode in the UI.
- Do not use this app as investment advice or as a source of official prices.
- NSE/BSE market data may be subject to exchange/vendor licensing. Configure a properly licensed provider before distributing live data.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Persistence: MongoDB Atlas
- Authentication: JWT

## Run locally
Requirements: Node.js 18+ and MongoDB (local or Atlas).

```bash
npm run install:all
```

Configure `backend/.env` using `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/alphametrics
JWT_SECRET=replace-with-a-long-random-secret
```

Start the app:

```bash
npm run dev
```

The frontend Vite server and backend API start together. Check `frontend/vite.config.js` for the dev port and API proxy configuration.

## Production checklist
1. Set a strong unique `JWT_SECRET` and production MongoDB credentials.
2. Restrict CORS to the deployed frontend origin.
3. Keep provider credentials only on the server; never commit `.env` files.
4. Add rate limits and request validation to authentication and trade routes.
5. Verify quote source, timestamp, market status and stale-data handling.
6. Ensure market-data licensing permits your intended use.
7. Test order validation, cash limits, holdings, and P&L calculations before launch.

See [PAPER_TRADING_SPEC.md](./PAPER_TRADING_SPEC.md) for order rules, portfolio maths, and acceptance checks.

## Disclaimer
This software is an educational simulator, not a broker, exchange, investment adviser, or financial product. Trades use virtual funds only. Market data can be delayed, unavailable, simulated, or inaccurate. Validate all information independently.
