import React,{useEffect,useState} from "react";
import AppLayout from "../../components/AppLayout.jsx";
import {stocksAPI} from "../../api/index.js";
import {getMockStocks} from "../../data/mockStocks.js";
import {useAuth} from "../../context/AuthContext.jsx";
export default function News(){
 const {dataMode}=useAuth(); const [items,setItems]=useState([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;(async()=>{try{const stocks=dataMode==="mock"?getMockStocks():await stocksAPI.all();const picks=stocks.slice(0,6);const results=await Promise.all(picks.map(s=>stocksAPI.news(s.symbol).catch(()=>[])));const merged=results.flat().filter(Boolean);const seen=new Set();const unique=merged.filter(n=>{const key=n.url||n.title;if(!key||seen.has(key))return false;seen.add(key);return true;});if(active)setItems(unique);}catch{}finally{if(active)setLoading(false);}})();return()=>{active=false;};},[dataMode]);
 return <AppLayout title="Market News"><main className="trade-page"><div className="trade-page-heading"><div className="eyebrow">STAY INFORMED</div><h1>Market news</h1><p>Updates linked to stocks in your Indian market universe.</p></div>
 {loading?<div className="news-empty">Loading market headlines…</div>:items.length===0?<div className="news-empty">No market headlines are available from the connected data source right now.</div>:<div className="news-feed">{items.map((n,i)=><article className="news-item" key={n.url||n.title||i}><div className="news-tag">{n.source||n.publisher||"MARKET UPDATE"}</div><h2>{n.title||n.headline||"Market update"}</h2>{n.summary&&<p>{n.summary}</p>}<div className="news-meta">{n.publishedAt?new Date(n.publishedAt).toLocaleString("en-IN"):""}{n.url&&<a href={n.url} target="_blank" rel="noreferrer">Read article ↗</a>}</div></article>)}</div>}
 <div className="paper-note"><span>ⓘ</span><p>Headlines are supplied by the connected market-data provider. This app does not provide investment advice.</p></div></main></AppLayout>;
}