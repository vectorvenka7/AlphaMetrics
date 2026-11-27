import React, { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout.jsx";
import BuySellModal from "../../components/BuySellModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { stocksAPI, portfolioAPI } from "../../api/index.js";
import { getMockStocks } from "../../data/mockStocks.js";

const money = (value) => "₹" + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function Dashboard() {
  const { user, balance, dataMode } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [positions, setPositions] = useState([]);
  const [equity, setEquity] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tradeType, setTradeType] = useState("BUY");
  const [period, setPeriod] = useState("1M");
  const isMock = dataMode === "mock";

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [s, p, e] = await Promise.all([
        isMock ? Promise.resolve(getMockStocks()) : stocksAPI.all().catch(() => []),
        portfolioAPI.positions().catch(() => []),
        portfolioAPI.equity(30).catch(() => [])
      ]);
      if (alive) { setStocks(s || []); setPositions(p || []); setEquity(e || []); }
    };
    load();
    const timer = setInterval(load, isMock ? 5000 : 60000);
    return () => { alive = false; clearInterval(timer); };
  }, [isMock]);

  const holdings = useMemo(() => positions.map((p) => {
    const stock = stocks.find((s) => s.symbol === p.symbol);
    const price = stock?.price ?? p.avgPrice;
    return { ...p, price, value: price * p.qty, pnl: (price - p.avgPrice) * p.qty, stock };
  }), [positions, stocks]);
  const invested = holdings.reduce((sum, p) => sum + p.avgPrice * p.qty, 0);
  const marketValue = holdings.reduce((sum, p) => sum + p.value, 0);
  const pnl = holdings.reduce((sum, p) => sum + p.pnl, 0);
  const pnlPct = invested ? pnl / invested * 100 : 0;
  const chartData = equity.map((p, i) => ({ day: i + 1, value: p.value }));
  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const featured = stocks.slice(0, 8);

  const openTrade = (stock, type) => { setSelected(stock); setTradeType(type); };

  return (
    <AppLayout title="My Portfolio">
      <main className="trade-home">
        <section className="trade-welcome">
          <div>
            <div className="eyebrow">YOUR INVESTMENT SPACE</div>
            <h1>Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.name?.split(" ")[0] || "Trader"}</h1>
            <p>Track the market. Practice with confidence.</p>
          </div>
          <span className={`mode-pill ${isMock ? "sim" : "live"}`}><i />{isMock ? "SIMULATED PRICES" : "MARKET DATA"}</span>
        </section>

        <section className="hero-balance">
          <div className="hero-balance-head"><span>PORTFOLIO VALUE</span><span className="hero-live-dot">● PAPER ACCOUNT</span></div>
          <div className="hero-balance-value">{money(balance + marketValue)}</div>
          <div className={`hero-pnl ${pnl >= 0 ? "positive" : "negative"}`}>{pnl >= 0 ? "↗" : "↘"} {money(Math.abs(pnl))} ({pnlPct.toFixed(2)}%) <span>overall unrealised P&L</span></div>
          <div className="hero-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="heroGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16d99a" stopOpacity=".34"/><stop offset="100%" stopColor="#16d99a" stopOpacity="0"/></linearGradient></defs>
                <XAxis dataKey="day" hide />
                <Tooltip contentStyle={{ background: "#151a20", border: "1px solid #29343b", borderRadius: 10, color: "#fff" }} formatter={(v) => [money(v), "Portfolio"]} />
                <Area type="monotone" dataKey="value" stroke="#19dfa0" strokeWidth={2.5} fill="url(#heroGreen)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-periods">{["1W", "1M", "3M", "1Y", "ALL"].map((p) => <button key={p} className={period === p ? "selected" : ""} onClick={() => setPeriod(p)}>{p}</button>)}</div>
        </section>

        <section className="quick-stats">
          <div><span>Available cash</span><strong>{money(balance)}</strong><small>Virtual funds</small></div>
          <div><span>Invested</span><strong>{money(invested)}</strong><small>{holdings.length} holdings</small></div>
          <div><span>Market value</span><strong>{money(marketValue)}</strong><small>Current positions</small></div>
        </section>

        <section className="trade-section">
          <div className="section-heading"><div><h2>Market watch</h2><p>Popular Indian stocks</p></div><button onClick={() => navigate("/market")}>See all <span>↗</span></button></div>
          <div className="market-list">
            {featured.slice(0, 6).map((s) => (
              <article className="market-row" key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)}>
                <div className="stock-mark">{s.symbol.slice(0, 1)}</div>
                <div className="stock-meta"><strong>{s.symbol}</strong><span>{s.name}</span></div>
                <div className="stock-price"><strong>{money(s.price)}</strong><span className={s.changePercent >= 0 ? "positive" : "negative"}>{s.changePercent >= 0 ? "+" : ""}{Number(s.changePercent || 0).toFixed(2)}%</span></div>
                <div className="stock-actions"><button onClick={(e) => { e.stopPropagation(); openTrade(s, "BUY"); }}>Buy</button></div>
              </article>
            ))}
            {!featured.length && <p className="empty-note">Market list is loading. Try again in a moment.</p>}
          </div>
        </section>

        <section className="trade-section">
          <div className="section-heading"><div><h2>Top movers</h2><p>Biggest positive moves in this sample feed</p></div></div>
          <div className="mover-grid">{gainers.slice(0, 4).map((s) => <button className="mover-card" key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)}><span>{s.symbol}</span><strong>{money(s.price)}</strong><em>↗ {Number(s.changePercent || 0).toFixed(2)}%</em></button>)}</div>
        </section>

        <section className="paper-note"><span>ⓘ</span><p><strong>Paper trading only.</strong> Your balance and orders use virtual funds. Prices in simulation mode are illustrative, not exchange quotes.</p></section>
      </main>
      {selected && <BuySellModal stock={selected} defaultType={tradeType} onClose={() => setSelected(null)} onTradeSuccess={() => portfolioAPI.positions().then(setPositions).catch(() => {})} />}
    </AppLayout>
  );
}
