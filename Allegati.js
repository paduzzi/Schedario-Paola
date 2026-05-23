import React from 'react';
import { exportAllToICS } from '../utils/calendar';

export default function HomeView({ tabs, sectionData, onNavigate }) {
  const urgenti = [];
  Object.entries(sectionData).forEach(([sId, data]) => {
    const tab = tabs.find(t=>t.id===sId);
    if (!tab || sId==='home') return;
    (data.checklist||[]).forEach(item => { if (!item.done && urgenti.length<6) urgenti.push({...item,tab,sId}); });
  });

  const scadenze = [];
  Object.entries(sectionData).forEach(([sId, data]) => {
    const tab = tabs.find(t=>t.id===sId);
    if (!tab || sId==='home') return;
    (data.scadenze||[]).forEach(s => scadenze.push({...s,tab,sId}));
    (data.convenzioni||[]).forEach(s => { if(s.scad) scadenze.push({id:s.id,text:s.nome,date:s.scad,urgente:s.urgente,tab,sId}); });
  });
  scadenze.sort((a,b) => {
    const p = d => { if(!d) return 9999; const [day,m]=d.split('/').map(Number); return (m||0)*100+(day||0); };
    return p(a.date)-p(b.date);
  });

  return (
    <>
      <div className="export-bar">
        <span style={{fontSize:11,color:'var(--ink3)'}}>Scadenze →</span>
        <button className="export-btn" onClick={() => exportAllToICS(sectionData, tabs)}>📅 Esporta in Google Calendar (.ics)</button>
      </div>
      <div className="home-grid">
        <div className="home-card">
          <div className="home-card-title">🔥 Da fare</div>
          {urgenti.slice(0,5).map((item,i) => (
            <div key={i} className="home-item" onClick={()=>onNavigate(item.sId)}>
              <span className="home-dot" style={{background:item.tab.color}} />
              <span className="home-text">{item.text}</span>
              <span className="home-badge" style={{background:item.tab.color+'22',color:item.tab.color}}>{item.tab.label}</span>
            </div>
          ))}
          {urgenti.length===0 && <p style={{color:'var(--ink3)',fontSize:12,fontStyle:'italic'}}>Tutto a posto ✓</p>}
        </div>

        <div className="home-card">
          <div className="home-card-title">📅 Scadenze</div>
          {scadenze.slice(0,6).map((s,i) => (
            <div key={i} className="home-item" onClick={()=>onNavigate(s.sId)}>
              <span className="home-dot" style={{background:s.tab.color}} />
              <span className="home-text">{s.text}</span>
              {s.urgente && <span className="urgent-pill">!</span>}
              <span className="home-date">{s.date}</span>
            </div>
          ))}
          {scadenze.length===0 && <p style={{color:'var(--ink3)',fontSize:12,fontStyle:'italic'}}>Nessuna scadenza</p>}
        </div>

        <div className="home-card">
          <div className="home-card-title">⭐ Principali</div>
          {['pasubio','alveare','dir','conv','mezzi'].map(sId => {
            const tab = tabs.find(t=>t.id===sId);
            if (!tab) return null;
            return (
              <div key={sId} className="home-item" onClick={()=>onNavigate(sId)}>
                <span className="home-dot" style={{background:tab.color}} />
                <span className="home-text">{tab.label}</span>
                <span style={{color:'var(--ink3)',fontSize:12}}>→</span>
              </div>
            );
          })}
        </div>

        <div className="home-card">
          <div className="home-card-title">🗂 Tutte le sezioni</div>
          {tabs.filter(t=>t.id!=='home').map(tab => (
            <div key={tab.id} className="home-item" onClick={()=>onNavigate(tab.id)}>
              <span className="home-dot" style={{background:tab.color}} />
              <span className="home-text">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
