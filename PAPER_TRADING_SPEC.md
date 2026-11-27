# Paper Trading Product Specification

## Product principles
- Indian equities first, INR-denominated balances, NSE symbols with an optional BSE listing identifier.
- Simulation is the default mode; real orders are not supported.
- Clearly label each quote as LIVE, DELAYED, or SIMULATED with source and last-updated time.
- Never imply simulation fills are equivalent to exchange execution.

## Core workflows
1. Create account / sign in.
2. Start with configurable virtual cash (default ₹10,00,000).
3. Search stocks and add them to a watchlist.
4. Preview a market or limit paper order.
5. Validate quantity, available virtual cash, and sellable holdings.
6. Simulate a fill at the selected quote/limit rule.
7. Update cash, positions, average price, realised P&L, and order history atomically.
8. Review performance and reset the practice account if desired.

## Order model
- Side: BUY or SELL.
- Type: MARKET or LIMIT.
- Status: OPEN, FILLED, CANCELLED, or REJECTED.
- Market simulation fills should use the current selected quote and configured slippage model.
- Limit BUY fills only when simulated price <= limit; limit SELL fills only when simulated price >= limit.
- Reject invalid quantity, insufficient cash, or insufficient holdings.
- Record fees as an explicitly configurable estimate; never label them as actual brokerage charges.

## Portfolio calculations
- Invested value = sum(quantity × average cost).
- Current value = sum(quantity × latest selected quote).
- Unrealised P&L = current value − invested value.
- Realised P&L is computed on sells using the chosen cost-basis method (FIFO recommended).
- Total P&L = realised P&L + unrealised P&L − simulated fees.
- Available cash must reconcile with all fills and resets.

## Data integrity and safeguards
- Quote schema includes symbol, exchange, price, currency, source, mode, timestamp, and stale flag.
- Disable new simulated orders when a required quote is missing or too stale.
- Use decimal-safe arithmetic (integer paise or a decimal library) for balances and fills.
- Persist order and portfolio changes in a transaction where supported.
- Store an immutable audit record for each order state transition.
- Do not expose provider API keys to the frontend.

## Acceptance checks
- Cannot buy more than available virtual cash.
- Cannot sell more than currently held quantity.
- Limit orders obey limit prices.
- A completed order updates cash, position, and history consistently.
- Refreshing/reopening preserves a user's paper portfolio.
- Simulation/live mode is always visible.
- Mobile screens remain usable at 360px width.
