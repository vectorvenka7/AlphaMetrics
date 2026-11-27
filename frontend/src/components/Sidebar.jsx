import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
const UserNavItems = [
 {icon:"⌂",label:"Dashboard",path:"/dashboard"},
 {icon:"⌕",label:"Discover",path:"/market"},
 {icon:"☆",label:"Watchlist",path:"/watchlist"},
 {icon:"▥",label:"Portfolio",path:"/portfolio"},
 {icon:"⋯",label:"More",path:"/more"},
 {icon:"▤",label:"Orders",path:"/orders",desktopOnly:true},
 {icon:"◷",label:"News",path:"/news",desktopOnly:true},
 {icon:"⟳",label:"Backtesting",path:"/backtest",desktopOnly:true},
 {icon:"♧",label:"Leaderboard",path:"/leaderboard",desktopOnly:true},
 {icon:"♧",label:"Alerts",path:"/alerts",desktopOnly:true}
];
const AdminNavItems=[{icon:"⬡",label:"Overview",path:"/admin"},{icon:"◈",label:"Users",path:"/admin/users"},{icon:"◎",label:"Trades",path:"/admin/trades"},{icon:"⬢",label:"Analytics",path:"/admin/analytics"},{icon:"⟳",label:"Settings",path:"/admin/settings"}];
export default function Sidebar({isOpen,onClose}) {
 const {user,logout,dataMode,toggleDataMode}=useAuth();
 const navigate=useNavigate(); const location=useLocation();
 const isAdmin=user?.role==="admin"; const navItems=isAdmin?AdminNavItems:UserNavItems;
 const handleNav=(path)=>{navigate(path);if(onClose)onClose();};
 const handleLogout=()=>{logout();navigate("/login");};
 return <><div className={"sidebar-overlay"+(isOpen?" visible":"")} onClick={onClose} aria-hidden="true"/>
 <aside className={"sidebar"+(isOpen?" open":"")}>
  <div className="sidebar-logo"><div className="sidebar-logo-text-wrap"><div className="logo-text">AlphaMetrics</div><div className="logo-sub">{isAdmin?"Admin Console":"Paper Trading"}</div></div><button className="sidebar-close-btn" onClick={onClose}>✕</button></div>
  <nav className="sidebar-nav"><div className="nav-section-label">Workspace</div>
   {navItems.map(item=><div key={item.path} className={"nav-item"+(item.desktopOnly?" desktop-nav-item":"")+((location.pathname===item.path||(item.path==="/market"&&location.pathname.startsWith("/stocks/")))?" active":"")} onClick={()=>handleNav(item.path)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&handleNav(item.path)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></div>)}
   {!isAdmin&&<div className="nav-item desktop-nav-item" onClick={()=>handleNav("/settings")} role="button" tabIndex={0}><span className="nav-icon">⚙</span><span>Settings</span></div>}
   {!isAdmin&&<div className="sidebar-data-mode" onClick={toggleDataMode} role="button" tabIndex={0}><div><strong>{dataMode==="live"?"Live market data":"Simulation mode"}</strong><small>{dataMode==="live"?"Yahoo Finance":"Virtual prices · 24/7"}</small></div><span className={"mode-switch"+(dataMode==="live"?" on":"")}/></div>}
  </nav>
  <div className="sidebar-footer"><div className="sidebar-user" onClick={handleLogout} title="Click to logout" role="button" tabIndex={0}><div className="sidebar-avatar" style={{background:user?.avatarColor||"var(--accent-green)"}}>{user?.name?.charAt(0)||"U"}</div><div className="sidebar-user-info"><div className="user-name">{user?.name?.split(" ")[0]||"User"}</div><div className="user-role">{isAdmin?"Administrator":"Trader"} · Logout</div></div></div></div>
 </aside></>;
}