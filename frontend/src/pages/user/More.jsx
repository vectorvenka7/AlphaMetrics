import React from "react";
import {useNavigate} from "react-router-dom";
import AppLayout from "../../components/AppLayout.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
const links=[
 {icon:"▤",title:"Orders",sub:"Review executed and pending paper trades",path:"/orders"},
 {icon:"◷",title:"Market news",sub:"Read headlines connected to tracked stocks",path:"/news"},
 {icon:"♧",title:"Price alerts",sub:"Manage your stock price notifications",path:"/alerts"},
 {icon:"⟳",title:"Backtesting",sub:"Test a strategy against historical data",path:"/backtest"},
 {icon:"♜",title:"Leaderboard",sub:"Compare paper trading performance",path:"/leaderboard"},
 {icon:"⚙",title:"Settings",sub:"Profile, virtual cash and market data mode",path:"/settings"}
];
export default function More(){
 const navigate=useNavigate();const {user,dataMode,logout}=useAuth();
 return <AppLayout title="More"><main className="trade-page"><div className="trade-page-heading"><div className="eyebrow">YOUR WORKSPACE</div><h1>More</h1><p>Account tools and trading activity.</p></div>
 <div className="more-profile"><div className="more-avatar">{user?.name?.charAt(0)||"U"}</div><div><strong>{user?.name||"Trader"}</strong><span>{user?.email||"Paper trading account"}</span></div><small>{dataMode==="mock"?"SIMULATION":"LIVE DATA"}</small></div>
 <div className="more-links">{links.map(x=><button className="more-link" key={x.path} onClick={()=>navigate(x.path)}><span className="more-link-icon">{x.icon}</span><span className="more-link-copy"><strong>{x.title}</strong><small>{x.sub}</small></span><span className="more-chevron">›</span></button>)}</div>
 <button className="more-logout" onClick={()=>{logout();navigate("/login");}}>Log out</button>
 <div className="paper-note"><span>ⓘ</span><p>AlphaMetrics is a paper-trading simulator. All orders and account balances are virtual.</p></div>
 </main></AppLayout>;
}